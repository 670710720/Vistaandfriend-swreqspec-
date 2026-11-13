from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError

from app.config import (
    CHAT_ATTACHMENT_MAX_SIZE_BYTES,
    CHAT_ATTACHMENT_RETENTION_DAYS,
    CHAT_MAX_ATTACHMENTS_PER_MESSAGE,
)
from app.main import create_app
from app.repositories.chat_repository import ChatRepository
from app.services.attachment_storage import AttachmentStorage, AttachmentStorageError
from app.services.chat_service import ProfileEligibilityUnavailable


class SearchableProfileChecker:
    def __init__(self):
        self.searchable_user_ids = {"student-1", "student-2"}

    def can_start_chat(self, sender_id: str, recipient_id: str):
        return recipient_id in self.searchable_user_ids, None

    def is_searchable(self, user_id: str) -> bool:
        return user_id in self.searchable_user_ids


class UnavailableProfileChecker:
    def can_start_chat(self, sender_id: str, recipient_id: str):
        return True, None

    def is_searchable(self, user_id: str) -> bool:
        raise ProfileEligibilityUnavailable("private provider details")


class UnknownProfileChecker:
    def can_start_chat(self, sender_id: str, recipient_id: str):
        return True, None

    def is_searchable(self, user_id: str):
        return None


def add_test_identity_middleware(app):
    # CON-AUTH-01: emulate trusted upstream middleware only in tests.
    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        request.state.user_id = request.headers.get("X-Test-Authenticated-User")
        return await call_next(request)


def create_test_app(
    tmp_path,
    storage: AttachmentStorage | None = None,
    profile_checker=None,
):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-attachments.db'}",
        attachment_storage=storage or AttachmentStorage(tmp_path / "attachment-files"),
        profile_checker=profile_checker or SearchableProfileChecker(),
    )
    add_test_identity_middleware(app)
    return app


def upload_attachment(client, filename, content, content_type, **form_data):
    data = {
        "sender_id": "student-1",
        "receiver_id": "student-2",
        "content": "ข้อความพร้อมไฟล์แนบ",
        **form_data,
    }
    return client.post(
        "/api/chat/messages/with-attachment",
        data=data,
        files=[("attachments", (filename, content, content_type))],
    )


@pytest.mark.parametrize(
    ("filename", "content", "content_type"),
    [
        ("room.jpg", b"\xff\xd8\xffjpeg-data", "image/jpeg"),
        ("room.png", b"\x89PNG\r\n\x1a\npng-data", "image/png"),
        ("room.pdf", b"%PDF-1.7\npdf-data", "application/pdf"),
    ],
)
def test_AC_CHAT_02A_sends_one_supported_file_with_message(
    tmp_path,
    filename,
    content,
    content_type,
):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    recipient = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})

    sent = upload_attachment(sender, filename, content, content_type)

    assert sent.status_code == 200, sent.text
    result = sent.json()
    assert result["sender_id"] == "student-1"
    assert result["receiver_id"] == "student-2"
    assert result["content"] == "ข้อความพร้อมไฟล์แนบ"
    assert result["attachment"]["name"] == filename
    assert result["attachment"]["content_type"] == content_type
    assert result["attachment"]["size_bytes"] == len(content)

    downloaded = recipient.get(result["attachment"]["download_url"])
    assert downloaded.status_code == 200
    assert downloaded.content == content


def test_AC_CHAT_02A_accepts_attachment_at_size_limit(tmp_path):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    content = b"%PDF-" + b"x" * (CHAT_ATTACHMENT_MAX_SIZE_BYTES - len(b"%PDF-"))

    response = upload_attachment(sender, "limit.pdf", content, "application/pdf")

    assert response.status_code == 200, response.text
    assert response.json()["attachment"]["size_bytes"] == CHAT_ATTACHMENT_MAX_SIZE_BYTES


def test_AC_CHAT_02B_rejects_multiple_unsupported_and_oversized_files(tmp_path):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    base_data = {
        "sender_id": "student-1",
        "receiver_id": "student-2",
        "content": "ข้อความที่มีไฟล์ไม่ถูกต้อง",
    }

    file_count = CHAT_MAX_ATTACHMENTS_PER_MESSAGE + 1
    multiple_files = sender.post(
        "/api/chat/messages/with-attachment",
        data=base_data,
        files=[
            ("attachments", (f"file-{index}.pdf", b"%PDF-1.7", "application/pdf"))
            for index in range(file_count)
        ],
    )
    unsupported_file = upload_attachment(
        sender,
        "notes.txt",
        b"unsupported",
        "text/plain",
    )
    oversized_file = upload_attachment(
        sender,
        "large.pdf",
        b"%PDF-" + b"x" * CHAT_ATTACHMENT_MAX_SIZE_BYTES,
        "application/pdf",
    )

    assert multiple_files.status_code == 422
    assert unsupported_file.status_code == 415
    assert oversized_file.status_code == 413
    history = sender.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert history.status_code == 200
    assert history.json() == []


def test_AC_CHAT_02B_rejects_missing_attachment(tmp_path):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    response = sender.post(
        "/api/chat/messages/with-attachment",
        data={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "ข้อความที่ไม่มีไฟล์แนบ",
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "One attachment is required"
    history = sender.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert history.json() == []


def test_AC_CHAT_02B_rejects_file_signature_mismatch(tmp_path):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    response = upload_attachment(
        sender,
        "fake.png",
        b"%PDF-1.7\nnot-a-png",
        "image/png",
    )

    assert response.status_code == 415
    assert response.json()["detail"] == "Attachment content does not match its file type"


@pytest.mark.parametrize("content_type", ["image/png", "application/octet-stream"])
def test_AC_CHAT_02B_rejects_spoofed_mime_type(tmp_path, content_type):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    response = upload_attachment(
        sender,
        "valid.pdf",
        b"%PDF-1.7\nvalid-pdf",
        content_type,
    )

    assert response.status_code == 415
    assert response.json()["detail"] == "Attachment content type does not match its file type"


def test_AC_CHAT_03A_history_returns_related_attachment(tmp_path):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    recipient = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})

    sent = upload_attachment(
        sender,
        "history.pdf",
        b"%PDF-1.7\nhistory",
        "application/pdf",
    )
    history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert sent.status_code == 200, sent.text
    assert history.status_code == 200, history.text
    assert len(history.json()) == 1
    message = history.json()[0]
    assert message["content"] == "ข้อความพร้อมไฟล์แนบ"
    assert message["attachment"]["id"] == sent.json()["attachment"]["id"]
    assert message["attachment"]["download_url"] == sent.json()["attachment"]["download_url"]


def test_AC_CHAT_03C_downloads_attachment_within_retention(
    tmp_path,
    monkeypatch,
):
    sent_at = datetime(2026, 1, 1, tzinfo=timezone.utc)

    class FrozenDateTime(datetime):
        current = sent_at

        @classmethod
        def now(cls, tz=None):
            return cls.current if tz is None else cls.current.astimezone(tz)

    monkeypatch.setattr("app.main.datetime", FrozenDateTime)
    monkeypatch.setattr("app.repositories.chat_repository.datetime", FrozenDateTime)
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    recipient = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})
    sent = upload_attachment(
        sender,
        "retained.pdf",
        b"%PDF-1.7\nretained",
        "application/pdf",
    )
    FrozenDateTime.current = sent_at + timedelta(days=CHAT_ATTACHMENT_RETENTION_DAYS)

    history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    downloaded = recipient.get(sent.json()["attachment"]["download_url"])

    assert history.status_code == 200
    assert history.json()[0]["attachment"] is not None
    assert downloaded.status_code == 200
    assert downloaded.content == b"%PDF-1.7\nretained"

    FrozenDateTime.current += timedelta(microseconds=1)
    just_expired = recipient.get(sent.json()["attachment"]["download_url"])
    expired_history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    assert just_expired.status_code == 410
    assert expired_history.json()[0]["attachment"] is None


def test_AC_CHAT_03D_hides_expired_file_but_keeps_message(
    tmp_path,
    monkeypatch,
):
    sent_at = datetime(2026, 1, 1, tzinfo=timezone.utc)

    class FrozenDateTime(datetime):
        current = sent_at

        @classmethod
        def now(cls, tz=None):
            return cls.current if tz is None else cls.current.astimezone(tz)

    monkeypatch.setattr("app.main.datetime", FrozenDateTime)
    monkeypatch.setattr("app.repositories.chat_repository.datetime", FrozenDateTime)
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    recipient = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})
    sent = upload_attachment(
        sender,
        "expired.pdf",
        b"%PDF-1.7\nexpired",
        "application/pdf",
    )
    FrozenDateTime.current = sent_at + timedelta(days=CHAT_ATTACHMENT_RETENTION_DAYS + 1)

    history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )
    downloaded = recipient.get(sent.json()["attachment"]["download_url"])

    assert sent.status_code == 200, sent.text
    assert history.status_code == 200
    assert len(history.json()) == 1
    assert history.json()[0]["content"] == "ข้อความพร้อมไฟล์แนบ"
    assert history.json()[0]["attachment"] is None
    assert downloaded.status_code == 410


def test_AC_CHAT_08_denies_nonparticipant_attachment(tmp_path):
    app = create_test_app(tmp_path)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    outsider = TestClient(app, headers={"X-Test-Authenticated-User": "student-3"})
    sent = upload_attachment(
        sender,
        "private.pdf",
        b"%PDF-1.7\nprivate",
        "application/pdf",
    )

    response = outsider.get(sent.json()["attachment"]["download_url"])

    assert sent.status_code == 200, sent.text
    assert response.status_code == 403


def test_attachment_storage_failure_does_not_create_a_message(tmp_path):
    blocked_root = tmp_path / "not-a-directory"
    blocked_root.write_text("not a directory")
    app = create_test_app(tmp_path, AttachmentStorage(blocked_root))
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    response = upload_attachment(
        sender,
        "storage.pdf",
        b"%PDF-1.7\nstorage",
        "application/pdf",
    )
    history = sender.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "ไม่สามารถบันทึกไฟล์แนบได้ กรุณาลองใหม่"
    assert history.json() == []


def test_attachment_metadata_failure_removes_unattached_file(tmp_path, monkeypatch):
    storage = AttachmentStorage(tmp_path / "attachment-files")
    app = create_test_app(tmp_path, storage)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    def fail_persistence(*args, **kwargs):
        raise SQLAlchemyError("private database detail")

    monkeypatch.setattr(
        ChatRepository,
        "create_message_with_attachment",
        staticmethod(fail_persistence),
    )
    response = upload_attachment(
        sender,
        "rollback.pdf",
        b"%PDF-1.7\nrollback",
        "application/pdf",
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "ไม่สามารถบันทึกข้อความและไฟล์แนบได้ กรุณาลองใหม่"
    assert "private database detail" not in response.text
    assert list(storage.root.iterdir()) == []


def test_attachment_cleanup_failure_returns_safe_error_and_logs_orphan(
    tmp_path,
    monkeypatch,
    caplog,
):
    class FailingCleanupStorage(AttachmentStorage):
        def delete(self, storage_key):
            raise AttachmentStorageError("private storage detail")

    storage = FailingCleanupStorage(tmp_path / "attachment-files")
    app = create_test_app(tmp_path, storage)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    def fail_persistence(*args, **kwargs):
        raise SQLAlchemyError("private database detail")

    monkeypatch.setattr(
        ChatRepository,
        "create_message_with_attachment",
        staticmethod(fail_persistence),
    )
    response = upload_attachment(
        sender,
        "orphan.pdf",
        b"%PDF-1.7\norphan",
        "application/pdf",
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "ไม่สามารถบันทึกข้อความและไฟล์แนบได้ กรุณาลองใหม่"
    assert "private" not in response.text
    assert "Failed to remove unattached chat file after persistence failure" in caplog.text
    assert len(list(storage.root.iterdir())) == 1


@pytest.mark.parametrize("unsearchable_user_id", ["student-1", "student-2"])
def test_AC_CHAT_07B_rejects_attachment_when_either_participant_is_unsearchable(
    tmp_path,
    unsearchable_user_id,
):
    checker = SearchableProfileChecker()
    storage = AttachmentStorage(tmp_path / "attachment-files")
    app = create_test_app(tmp_path, storage, checker)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})
    recipient = TestClient(app, headers={"X-Test-Authenticated-User": "student-2"})
    existing_message = sender.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Existing readable history",
        },
    )
    assert existing_message.status_code == 200, existing_message.text

    checker.searchable_user_ids.remove(unsearchable_user_id)
    denied_upload = upload_attachment(
        sender,
        "blocked.pdf",
        b"%PDF-1.7\nblocked",
        "application/pdf",
    )
    history = recipient.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert denied_upload.status_code == 403
    assert history.status_code == 200, history.text
    assert [message["content"] for message in history.json()] == [
        "Existing readable history"
    ]
    assert not storage.root.exists() or list(storage.root.iterdir()) == []


@pytest.mark.parametrize(
    "profile_checker",
    [None, UnavailableProfileChecker(), UnknownProfileChecker()],
    ids=["missing-provider", "unavailable-provider", "unknown-status"],
)
def test_AC_CHAT_07B_attachment_fails_closed_without_confirmed_provider(
    tmp_path,
    profile_checker,
):
    storage = AttachmentStorage(tmp_path / "attachment-files")
    if profile_checker is None:
        app = create_app(
            f"sqlite:///{tmp_path / 'chat-no-profile-provider.db'}",
            attachment_storage=storage,
        )
        add_test_identity_middleware(app)
    else:
        app = create_test_app(tmp_path, storage, profile_checker)
    sender = TestClient(app, headers={"X-Test-Authenticated-User": "student-1"})

    denied_upload = upload_attachment(
        sender,
        "blocked.pdf",
        b"%PDF-1.7\nblocked",
        "application/pdf",
    )
    history = sender.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert denied_upload.status_code == 503
    assert denied_upload.json()["detail"] == "ไม่สามารถยืนยันสถานะการค้นหาได้ กรุณาลองใหม่"
    assert "private provider details" not in denied_upload.text
    assert history.status_code == 200
    assert history.json() == []
    assert not storage.root.exists() or list(storage.root.iterdir()) == []
