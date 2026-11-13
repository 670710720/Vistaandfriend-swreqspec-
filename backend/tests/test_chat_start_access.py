from fastapi.testclient import TestClient

from app.main import create_app


class SearchableRecipientChecker:
    def can_start_chat(self, sender_id: str, recipient_id: str):
        if recipient_id == "student-2":
            return True, None
        return False, "recipient is not allowed to receive a new chat"


class UnsearchableRecipientChecker:
    def can_start_chat(self, sender_id: str, recipient_id: str):
        return False, "recipient profile is not searchable or is closed"


def test_AC_CHAT_01_open_chat_when_recipient_is_searchable(tmp_path):
    app = create_app(f"sqlite:///{tmp_path / 'chat-open.db'}", profile_checker=SearchableRecipientChecker())
    client = TestClient(app)

    response = client.post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-2"},
    )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["allowed"] is True
    assert payload["reason"] is None
    assert payload["room_id"] == "student-1:student-2"


def test_AC_CHAT_07_rejects_chat_when_recipient_is_not_searchable(tmp_path):
    app = create_app(f"sqlite:///{tmp_path / 'chat-deny.db'}", profile_checker=UnsearchableRecipientChecker())
    client = TestClient(app)

    response = client.post(
        "/api/chat/open",
        json={"sender_id": "student-1", "recipient_id": "student-3"},
    )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["allowed"] is False
    assert payload["reason"] == "recipient profile is not searchable or is closed"
    assert payload["room_id"] is None


def test_AC_CHAT_07A_accepts_only_allowed_profile_state(tmp_path):
    app = create_app(f"sqlite:///{tmp_path / 'chat-allow.db'}", profile_checker=SearchableRecipientChecker())
    client = TestClient(app)

    response = client.post(
        "/api/chat/open",
        json={"sender_id": "student-4", "recipient_id": "student-2"},
    )

    assert response.status_code == 200, response.text
    assert response.json()["allowed"] is True
