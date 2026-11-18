import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.services.chat_contact_provider import DEMO_CURRENT_USER_ID


def add_test_identity_middleware(app, user_id: str):
    # CON-AUTH-01: emulate an external trusted identity provider only in tests.
    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        request.state.user_id = user_id
        return await call_next(request)


def test_chat_list_requires_authenticated_identity_and_contact_provider(tmp_path):
    unauthenticated_app = create_app(f"sqlite:///{tmp_path / 'chat-list-unauthenticated.db'}")
    response_without_identity = TestClient(unauthenticated_app).get("/api/chat/list")
    assert response_without_identity.status_code == 401

    app = create_app(f"sqlite:///{tmp_path / 'chat-list-no-provider.db'}")
    add_test_identity_middleware(app, "student-1")
    response_without_provider = TestClient(app).get("/api/chat/list")
    assert response_without_provider.status_code == 503
    assert response_without_provider.json()["detail"] == "Student contact provider is not configured"


def test_demo_chat_list_open_and_history_use_backend_api(tmp_path):
    app = create_app(
        f"sqlite:///{tmp_path / 'chat-list-demo.db'}",
        demo_mode=True,
        runtime_environment="development",
    )
    client = TestClient(app)

    chat_list = client.get("/api/chat/list")

    assert chat_list.status_code == 200, chat_list.text
    payload = chat_list.json()
    assert payload["current_user_id"] == DEMO_CURRENT_USER_ID
    assert payload["demo_mode"] is True
    assert [contact["id"] for contact in payload["contacts"]] == [
        "demo-student-2",
        "demo-student-3",
    ]

    recipient_id = payload["contacts"][0]["id"]
    opened = client.post(
        "/api/chat/open",
        json={"sender_id": DEMO_CURRENT_USER_ID, "recipient_id": recipient_id},
    )
    assert opened.status_code == 200, opened.text
    assert opened.json()["allowed"] is True
    assert opened.json()["read_only"] is True

    history = client.get(
        "/api/chat/messages",
        params={"sender_id": DEMO_CURRENT_USER_ID, "receiver_id": recipient_id},
    )
    assert history.status_code == 200, history.text
    assert history.json() == []

    spoofed_sender = client.post(
        "/api/chat/open",
        json={"sender_id": recipient_id, "recipient_id": "demo-student-3"},
    )
    assert spoofed_sender.status_code == 403


def test_demo_mode_is_rejected_outside_development(tmp_path):
    with pytest.raises(RuntimeError, match="APP_ENV=development"):
        create_app(
            f"sqlite:///{tmp_path / 'chat-list-production.db'}",
            demo_mode=True,
            runtime_environment="production",
        )
