from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import sqlite3
from time import perf_counter
from zoneinfo import ZoneInfo

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import (
    CHAT_ATTACHMENT_MAX_SIZE_BYTES,
    CHAT_ATTACHMENT_RETENTION_DAYS,
    CHAT_AUTOMATIC_RETRY_LIMIT,
    CHAT_MAX_ATTACHMENTS_PER_MESSAGE,
    CHAT_MESSAGE_MAX_LENGTH,
    CHAT_MESSAGE_MIN_LENGTH,
    CHAT_SEND_RESPONSE_LIMIT_SECONDS,
    CHAT_TIMEZONE,
    CHAT_USABILITY_MIN_SUCCESS_COUNT,
    CHAT_USABILITY_TEST_USER_COUNT,
)
from app.main import create_app
from app.models.chat_message import Base
from app.repositories.chat_repository import ChatRepository


class SearchableProfileChecker:
    def can_start_chat(self, sender_id: str, recipient_id: str):
        return True, None

    def is_searchable(self, user_id: str) -> bool:
        return True


def create_test_app(database_url: str):
    return create_app(database_url, profile_checker=SearchableProfileChecker())


def add_test_identity_middleware(app):
    # CON-AUTH-01: emulate trusted upstream middleware only in tests.
    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        request.state.user_id = request.headers.get("X-Test-Authenticated-User")
        return await call_next(request)


def test_feature_config_values():
    assert CHAT_MESSAGE_MIN_LENGTH == 1
    assert CHAT_MESSAGE_MAX_LENGTH == 2_000
    assert CHAT_MAX_ATTACHMENTS_PER_MESSAGE == 1
    assert CHAT_ATTACHMENT_MAX_SIZE_BYTES == 10 * 1024 * 1024
    assert CHAT_AUTOMATIC_RETRY_LIMIT == 3
    assert CHAT_ATTACHMENT_RETENTION_DAYS == 30
    assert CHAT_SEND_RESPONSE_LIMIT_SECONDS == 3
    assert CHAT_USABILITY_TEST_USER_COUNT == 5
    assert CHAT_USABILITY_MIN_SUCCESS_COUNT == 4
    assert CHAT_TIMEZONE == "Asia/Bangkok"


def test_chat_schema_and_history_smoke(tmp_path):
    db_path = tmp_path / "chat.db"
    app = create_test_app(f"sqlite:///{db_path}")
    add_test_identity_middleware(app)
    sender_client = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    receiver_client = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})

    first_message = sender_client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Hello roomie",
        },
    )
    second_message = receiver_client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-2",
            "receiver_id": "student-1",
            "content": "Hi back",
        },
    )
    unrelated_message = receiver_client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-2",
            "receiver_id": "student-3",
            "content": "This should not appear",
        },
    )

    assert first_message.status_code == 200, first_message.text
    assert second_message.status_code == 200, second_message.text
    assert unrelated_message.status_code == 200, unrelated_message.text

    history = sender_client.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert history.status_code == 200, history.text
    payload = history.json()
    assert [message["content"] for message in payload] == ["Hello roomie", "Hi back"]
    assert all(message["sender_id"] != "student-3" for message in payload)
    assert all(message["receiver_id"] != "student-3" for message in payload)


def test_AC_CHAT_02_persists_sender_receiver_and_time(tmp_path):
    database_path = tmp_path / "chat-ac-02.db"
    app = create_test_app(f"sqlite:///{database_path}")
    add_test_identity_middleware(app)
    client = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    started_at = datetime.now(timezone.utc)

    response = client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Persisted message",
        },
    )
    finished_at = datetime.now(timezone.utc)

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["sender_id"] == "student-1"
    assert payload["receiver_id"] == "student-2"
    assert payload["content"] == "Persisted message"

    api_time = datetime.fromisoformat(payload["created_at"])
    assert api_time.utcoffset() == ZoneInfo(CHAT_TIMEZONE).utcoffset(api_time)
    sent_at_utc = api_time.astimezone(timezone.utc)
    assert started_at <= sent_at_utc <= finished_at

    with sqlite3.connect(database_path) as connection:
        stored_value = connection.execute(
            "SELECT created_at FROM chat_messages WHERE id = ?",
            (payload["id"],),
        ).fetchone()[0]
    stored_time = datetime.fromisoformat(stored_value)
    if stored_time.tzinfo is None:
        stored_time = stored_time.replace(tzinfo=timezone.utc)
    assert stored_time.astimezone(timezone.utc) == sent_at_utc


def test_AC_CHAT_02C_rejects_empty_and_over_limit_text(tmp_path):
    app = create_test_app(f"sqlite:///{tmp_path / 'chat-ac-02c.db'}")
    add_test_identity_middleware(app)
    client = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    for content in ("", " \t\n", "a" * (CHAT_MESSAGE_MAX_LENGTH + 1)):
        response = client.post(
            "/api/chat/messages",
            json={
                "sender_id": "student-1",
                "receiver_id": "student-2",
                "content": content,
            },
        )
        assert response.status_code == 422, response.text
        assert "content" in str(response.json()["detail"])

    history = client.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert history.status_code == 200, history.text
    assert history.json() == []

    boundary_message = "a" * CHAT_MESSAGE_MAX_LENGTH
    boundary_response = client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": boundary_message,
        },
    )
    assert boundary_response.status_code == 200, boundary_response.text
    assert boundary_response.json()["content"] == boundary_message


def test_AC_CHAT_03_recipient_sees_sent_message(tmp_path):
    app = create_test_app(f"sqlite:///{tmp_path / 'chat-ac-03.db'}")
    add_test_identity_middleware(app)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    recipient = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})

    sent = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Visible from receiver history",
        },
    )
    assert sent.status_code == 200, sent.text

    received_history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert received_history.status_code == 200, received_history.text
    assert len(received_history.json()) == 1
    assert received_history.json()[0]["content"] == "Visible from receiver history"


def test_AC_CHAT_04_failed_message_is_not_shown_as_sent(tmp_path, monkeypatch):
    app = create_test_app(f"sqlite:///{tmp_path / 'chat-ac-04.db'}")
    add_test_identity_middleware(app)
    client = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    def fail_persistence(*args, **kwargs):
        raise SQLAlchemyError("private database connection detail")

    monkeypatch.setattr(ChatRepository, "create_message", staticmethod(fail_persistence))

    failed_send = client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Must not appear as sent",
        },
    )
    assert failed_send.status_code == 503
    assert failed_send.json() == {"detail": "ไม่สามารถบันทึกข้อความได้ กรุณาลองใหม่"}
    assert "private database connection detail" not in failed_send.text

    recipient_history = TestClient(
        app,
        headers={"X-Test-Authenticated-User": "student-2"},
    ).get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert recipient_history.status_code == 200, recipient_history.text
    assert recipient_history.json() == []


def test_CON_REL_01_rolls_back_message_when_commit_fails(tmp_path, monkeypatch):
    engine = create_engine(f"sqlite:///{tmp_path / 'chat-rollback.db'}")
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        def fail_commit():
            raise SQLAlchemyError("private database detail")

        monkeypatch.setattr(db, "commit", fail_commit)
        with pytest.raises(SQLAlchemyError):
            ChatRepository.create_message(
                db,
                sender_id="student-1",
                receiver_id="student-2",
                content="Should be rolled back",
            )

        assert not db.in_transaction()
        assert ChatRepository.list_messages(
            db,
            sender_id="student-1",
            receiver_id="student-2",
        ) == []


# CON-DATA-01, CON-TECH-01, NFR-REL-01
def test_chat_repository_persists_messages_for_multiple_pairs(tmp_path):
    app = create_test_app(f"sqlite:///{tmp_path / 'chat.db'}")
    add_test_identity_middleware(app)
    messages = [
        ("student-1", "student-2", "Hello"),
        ("student-2", "student-1", "Hi"),
        ("student-3", "student-4", "Separate conversation"),
    ]

    for sender_id, receiver_id, content in messages:
        client = TestClient(app, headers={"X-Test-Authenticated-User": sender_id})
        response = client.post(
            "/api/chat/messages",
            json={
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "content": content,
            },
        )
        assert response.status_code == 200, response.text

    first_pair_history = TestClient(
        app,
        headers={"X-Test-Authenticated-User": "student-1"},
    ).get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    second_pair_history = TestClient(
        app,
        headers={"X-Test-Authenticated-User": "student-3"},
    ).get(
        "/api/chat/messages",
        params={"sender_id": "student-3", "receiver_id": "student-4"},
    )

    assert [message["content"] for message in first_pair_history.json()] == ["Hello", "Hi"]
    assert [message["content"] for message in second_pair_history.json()] == [
        "Separate conversation"
    ]


# CON-TECH-01, NFR-PERF-01
def test_chat_pair_concurrency_and_latency_smoke(tmp_path):
    app = create_test_app(f"sqlite:///{tmp_path / 'chat.db'}")
    add_test_identity_middleware(app)
    pairs = [("student-1", "student-2"), ("student-3", "student-4")]

    def send_message(pair):
        started_at = perf_counter()
        with TestClient(
            app,
            headers={"X-Test-Authenticated-User": pair[0]},
        ) as client:
            response = client.post(
                "/api/chat/messages",
                json={
                    "sender_id": pair[0],
                    "receiver_id": pair[1],
                    "content": "Concurrent message",
                },
            )
        return response, perf_counter() - started_at

    with ThreadPoolExecutor(max_workers=len(pairs)) as executor:
        results = list(executor.map(send_message, pairs))

    assert all(response.status_code == 200 for response, _ in results)
    assert all(
        duration <= CHAT_SEND_RESPONSE_LIMIT_SECONDS
        for _, duration in results
    )

    for sender_id, receiver_id in pairs:
        with TestClient(
            app,
            headers={"X-Test-Authenticated-User": sender_id},
        ) as client:
            history = client.get(
                "/api/chat/messages",
                params={"sender_id": sender_id, "receiver_id": receiver_id},
            )
            assert history.status_code == 200, history.text
            assert [message["content"] for message in history.json()] == [
                "Concurrent message"
            ]


def test_AC_CHAT_03B_marks_only_visible_message_read(tmp_path):
    app = create_test_app(f"sqlite:///{tmp_path / 'chat-read.db'}")
    add_test_identity_middleware(app)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    recipient = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})

    first = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Visible message",
        },
    )
    second = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Not visible yet",
        },
    )
    assert first.status_code == second.status_code == 200

    marked = recipient.post(f"/api/chat/messages/{first.json()['id']}/read")
    history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    sender_cannot_mark = sender.post(f"/api/chat/messages/{second.json()['id']}/read")

    assert marked.status_code == 200, marked.text
    assert marked.json() == {"id": first.json()["id"], "is_read": True}
    assert [message["is_read"] for message in history.json()] == [True, False]
    assert sender_cannot_mark.status_code == 404


def test_existing_database_adds_read_column_without_losing_history(tmp_path):
    database_path = tmp_path / "legacy-chat.db"
    with sqlite3.connect(database_path) as connection:
        connection.execute(
            "CREATE TABLE chat_messages ("
            "id INTEGER PRIMARY KEY, sender_id VARCHAR(100) NOT NULL, "
            "receiver_id VARCHAR(100) NOT NULL, content TEXT NOT NULL, "
            "created_at DATETIME NOT NULL)"
        )
        connection.execute(
            "INSERT INTO chat_messages "
            "(id, sender_id, receiver_id, content, created_at) "
            "VALUES (1, 'student-1', 'student-2', 'Existing history', "
            "'2026-01-01 00:00:00.000000')"
        )

    app = create_test_app(f"sqlite:///{database_path}")
    add_test_identity_middleware(app)
    with TestClient(app) as client:
        response = client.get(
            "/api/chat/messages",
            params={"sender_id": "student-1", "receiver_id": "student-2"},
            headers={"X-Test-Authenticated-User": "student-1"},
        )

    assert response.status_code == 200, response.text
    assert len(response.json()) == 1
    assert response.json()[0]["content"] == "Existing history"
    assert response.json()[0]["is_read"] is False
