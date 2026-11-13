import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.services.chat_service import ChatService, ProfileEligibilityUnavailable


class SearchableRecipientChecker:
    def __init__(self):
        self.searchable_user_ids = {"student-1", "student-2", "student-4"}
        self.checked_user_ids = []

    def can_start_chat(self, sender_id: str, recipient_id: str):
        if recipient_id in self.searchable_user_ids:
            return True, None
        return False, "recipient is not allowed to receive a new chat"

    def is_searchable(self, user_id: str) -> bool:
        self.checked_user_ids.append(user_id)
        return user_id in self.searchable_user_ids


class UnsearchableRecipientChecker:
    def can_start_chat(self, sender_id: str, recipient_id: str):
        return False, "recipient profile is not searchable or is closed"

    def is_searchable(self, user_id: str) -> bool:
        return False


class UnavailableSearchabilityChecker(SearchableRecipientChecker):
    def is_searchable(self, user_id: str) -> bool:
        if user_id == "student-2":
            raise ProfileEligibilityUnavailable("private provider details")
        return True


class UnknownSearchabilityChecker(SearchableRecipientChecker):
    def is_searchable(self, user_id: str):
        if user_id == "student-2":
            return None
        return True


def add_test_identity_middleware(app):
    # CON-AUTH-01: emulate trusted upstream middleware only in tests.
    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        request.state.user_id = request.headers.get("X-Test-Authenticated-User")
        return await call_next(request)


def authenticated_client(app, user_id: str) -> TestClient:
    return TestClient(app, headers={"X-Test-Authenticated-User": user_id})


def test_AC_CHAT_01_selects_student_and_opens_history(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-open.db'}",
        profile_checker=SearchableRecipientChecker(),
    )
    add_test_identity_middleware(app)
    client = authenticated_client(app, "student-1")

    sent_message = client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Persisted conversation history",
        },
    )
    assert sent_message.status_code == 200, sent_message.text

    response = client.post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-2"},
    )
    history = client.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert response.status_code == 200, response.text
    assert response.json()["allowed"] is True
    assert history.status_code == 200, history.text
    assert [message["content"] for message in history.json()] == [
        "Persisted conversation history"
    ]


def test_AC_CHAT_05_loads_persisted_history(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-history.db'}",
        profile_checker=SearchableRecipientChecker(),
    )
    add_test_identity_middleware(app)
    sender = authenticated_client(app, "student-1")

    sent_message = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Saved before reopening",
        },
    )
    assert sent_message.status_code == 200, sent_message.text

    reopened_history = authenticated_client(app, "student-2").get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert reopened_history.status_code == 200, reopened_history.text
    assert [message["content"] for message in reopened_history.json()] == [
        "Saved before reopening"
    ]


def test_AC_CHAT_06_denies_nonparticipant_history(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-private.db'}",
        profile_checker=SearchableRecipientChecker(),
    )
    add_test_identity_middleware(app)
    participant = authenticated_client(app, "student-1")

    sent_message = participant.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Private conversation",
        },
    )
    assert sent_message.status_code == 200, sent_message.text

    response = authenticated_client(app, "student-3").get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Only conversation participants can access this history"


def test_AC_CHAT_07_rejects_ineligible_recipient_with_reason(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-deny.db'}",
        profile_checker=UnsearchableRecipientChecker(),
    )
    add_test_identity_middleware(app)

    response = authenticated_client(app, "student-1").post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-3"},
    )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["allowed"] is False
    assert payload["read_only"] is False
    assert payload["reason"] == "recipient profile is not searchable or is closed"
    assert payload["room_id"] is None


def test_AC_CHAT_07A_allows_searchable_recipient(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-allow.db'}",
        profile_checker=SearchableRecipientChecker(),
    )
    add_test_identity_middleware(app)

    response = authenticated_client(app, "student-4").post(
        "/api/chat/open",
        json={"sender_id": "student-4", "recipient_id": "student-2"},
    )

    assert response.status_code == 200, response.text
    assert response.json()["allowed"] is True
    assert response.json()["read_only"] is False
    assert response.json()["room_id"] == "student-4:student-2"


def test_AC_CHAT_07_new_disallowed_chat_does_not_create_room_or_allow_history(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-denied-new-room.db'}",
        profile_checker=UnsearchableRecipientChecker(),
    )
    add_test_identity_middleware(app)
    client = authenticated_client(app, "student-1")

    opened = client.post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-3"},
    )
    history = client.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-3"},
    )

    assert opened.status_code == 200, opened.text
    assert opened.json() == {
        "allowed": False,
        "read_only": False,
        "reason": "recipient profile is not searchable or is closed",
        "room_id": None,
    }
    assert history.status_code == 200, history.text
    assert history.json() == []


def test_CON_AUTH_01_denies_missing_or_mismatched_identity(tmp_path):
    app = create_app(f"sqlite:///{tmp_path / 'chat-auth.db'}")
    add_test_identity_middleware(app)

    unauthenticated = TestClient(app)
    missing_identity = unauthenticated.post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-2"},
    )
    assert missing_identity.status_code == 401

    missing_identity_history = unauthenticated.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert missing_identity_history.status_code == 401

    missing_identity_send = unauthenticated.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Unauthenticated",
        },
    )
    assert missing_identity_send.status_code == 401

    authenticated_as_one = authenticated_client(app, "student-1")
    mismatched_sender = authenticated_as_one.post(
        "/api/chat/open",
        json={"sender_id": "student-2", "recipient_id": "student-3"},
    )
    assert mismatched_sender.status_code == 403

    mismatched_message_sender = authenticated_as_one.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-2",
            "receiver_id": "student-3",
            "content": "Impersonated sender",
        },
    )
    assert mismatched_message_sender.status_code == 403


@pytest.mark.parametrize("unsearchable_user_id", ["student-1", "student-2"])
def test_AC_CHAT_07B_existing_chat_is_read_only(tmp_path, unsearchable_user_id):
    checker = SearchableRecipientChecker()
    app = create_app(
        f"sqlite:///{tmp_path / f'chat-read-only-{unsearchable_user_id}.db'}",
        profile_checker=checker,
    )
    add_test_identity_middleware(app)
    sender = authenticated_client(app, "student-1")
    recipient = authenticated_client(app, "student-2")

    sent = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "History remains readable",
        },
    )
    assert sent.status_code == 200, sent.text

    checker.searchable_user_ids.remove(unsearchable_user_id)
    checker.checked_user_ids.clear()
    opened = sender.post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-2"},
    )
    history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert checker.checked_user_ids == ["student-1", "student-2"]
    checker.checked_user_ids.clear()
    denied_send = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Must remain read-only",
        },
    )

    assert opened.status_code == 200, opened.text
    assert opened.json()["allowed"] is True
    assert opened.json()["read_only"] is True
    assert opened.json()["room_id"] == "student-1:student-2"
    assert history.status_code == 200, history.text
    assert [message["content"] for message in history.json()] == [
        "History remains readable"
    ]
    assert denied_send.status_code == 403
    assert checker.checked_user_ids == ["student-1", "student-2"]
    assert denied_send.json()["detail"] == (
        "Conversation is read-only because a participant is not searchable"
    )


def test_AC_CHAT_07B_existing_history_opens_read_only_without_provider(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-history-no-provider.db'}",
        profile_checker=SearchableRecipientChecker(),
    )
    add_test_identity_middleware(app)
    client = authenticated_client(app, "student-1")

    sent = client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "History survives provider absence",
        },
    )
    assert sent.status_code == 200, sent.text

    app.state.chat_service = ChatService(profile_checker=None)
    opened = client.post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-2"},
    )
    history = client.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert opened.status_code == 200, opened.text
    assert opened.json()["allowed"] is True
    assert opened.json()["read_only"] is True
    assert history.status_code == 200, history.text
    assert [message["content"] for message in history.json()] == [
        "History survives provider absence"
    ]


def test_AC_CHAT_07B_missing_provider_fails_closed_but_allows_history(tmp_path):
    app = create_app(f"sqlite:///{tmp_path / 'chat-no-eligibility-provider.db'}")
    add_test_identity_middleware(app)
    sender = authenticated_client(app, "student-1")

    denied_send = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Provider is missing",
        },
    )
    history = sender.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert denied_send.status_code == 503
    assert denied_send.json()["detail"] == "ไม่สามารถยืนยันสถานะการค้นหาได้ กรุณาลองใหม่"
    assert history.status_code == 200, history.text
    assert history.json() == []


@pytest.mark.parametrize(
    "checker",
    [UnavailableSearchabilityChecker(), UnknownSearchabilityChecker()],
)
def test_AC_CHAT_07B_unavailable_or_unknown_provider_fails_closed(tmp_path, checker):
    app = create_app(
        f"sqlite:///{tmp_path / f'chat-provider-error-{type(checker).__name__}.db'}",
        profile_checker=checker,
    )
    add_test_identity_middleware(app)
    sender = authenticated_client(app, "student-1")

    denied_send = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Provider cannot confirm status",
        },
    )

    assert denied_send.status_code == 503
    assert denied_send.json()["detail"] == "ไม่สามารถยืนยันสถานะการค้นหาได้ กรุณาลองใหม่"
    assert "private provider details" not in denied_send.text
    history = sender.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert history.status_code == 200
    assert history.json() == []
