from fastapi.testclient import TestClient

from app.main import create_app


def test_chat_schema_and_history_smoke(tmp_path):
    db_path = tmp_path / "chat.db"
    app = create_app(f"sqlite:///{db_path}")
    client = TestClient(app)

    first_message = client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-1",
            "receiver_id": "student-2",
            "content": "Hello roomie",
        },
    )
    second_message = client.post(
        "/api/chat/messages",
        json={
            "sender_id": "student-2",
            "receiver_id": "student-1",
            "content": "Hi back",
        },
    )
    unrelated_message = client.post(
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

    history = client.get(
        "/api/chat/messages",
        params={"sender_id": "student-1", "receiver_id": "student-2"},
    )

    assert history.status_code == 200, history.text
    payload = history.json()
    assert [message["content"] for message in payload] == ["Hello roomie", "Hi back"]
    assert all(message["sender_id"] != "student-3" for message in payload)
    assert all(message["receiver_id"] != "student-3" for message in payload)
