import json

from fastapi.testclient import TestClient
from sqlalchemy import func, select

from app.config import PROFILE_AGE_MIN, ROOM_OCCUPANCY_LIMITS
from app.main import create_app
from app.models.roommate_profile import RoommateProfile


def _profile_data():
    # AC-RMP-01A: submit valid profile data, including an untrusted owner field.
    return {
        "nickname": "เมท",
        "age": str(PROFILE_AGE_MIN),
        "gender": "หญิง",
        "faculty": "วิทยาศาสตร์",
        "academicYear": "1",
        "user_id": "attacker-selected-owner",
        "phone": "0812345678",
        "roomType": "airConditioned",
        "occupants": str(ROOM_OCCUPANCY_LIMITS["airConditioned"]["min"]),
        "sleepBehaviors": ["กรน"],
        "otherSleepBehavior": "",
        "social": {},
    }


def _post_profile(client: TestClient):
    return client.post(
        "/api/roommate-profiles",
        data={"profileData": json.dumps(_profile_data(), ensure_ascii=False)},
        files={
            "profileImage": (
                "profile.png",
                b"image-bytes",
                "image/png",
            )
        },
    )


def test_AC_RMP_01A_rejects_request_without_trusted_identity(tmp_path):
    app = create_app(database_url=f"sqlite:///{tmp_path / 'profile-auth-missing.db'}")

    with TestClient(app) as client:
        response = _post_profile(client)

    assert response.status_code == 401


def test_AC_RMP_01A_profile_status_requires_trusted_identity(tmp_path):
    app = create_app(database_url=f"sqlite:///{tmp_path / 'profile-status-unauthenticated.db'}")

    with TestClient(app) as client:
        response = client.get("/api/roommate-profiles/me")

    assert response.status_code == 401


def test_AC_RMP_01A_profile_status_reports_whether_trusted_owner_has_profile(tmp_path):
    app = create_app(database_url=f"sqlite:///{tmp_path / 'profile-status-authenticated.db'}")

    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        request.state.user_id = "trusted-student"
        return await call_next(request)

    with TestClient(app) as client:
        missing_profile_response = client.get("/api/roommate-profiles/me")
        create_response = _post_profile(client)
        existing_profile_response = client.get("/api/roommate-profiles/me")

    assert missing_profile_response.status_code == 200
    assert missing_profile_response.json() == {"hasProfile": False}
    assert create_response.status_code == 201
    assert existing_profile_response.status_code == 200
    assert existing_profile_response.json() == {"hasProfile": True}


def test_AC_RMP_01A_uses_trusted_identity_and_rejects_second_profile(tmp_path):
    app = create_app(database_url=f"sqlite:///{tmp_path / 'profile-authenticated.db'}")

    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        request.state.user_id = "trusted-student"
        return await call_next(request)

    with TestClient(app) as client:
        first_response = _post_profile(client)
        second_response = _post_profile(client)

    assert first_response.status_code == 201
    assert first_response.json() == {"message": "สร้างโปรไฟล์สำเร็จ"}
    assert second_response.status_code == 409
    assert "errors" in second_response.json()

    with app.state.session_factory() as session:
        profile_count = session.scalar(select(func.count()).select_from(RoommateProfile))
        stored_profile = session.get(RoommateProfile, "trusted-student")

    assert profile_count == 1
    assert stored_profile is not None
    assert stored_profile.user_id == "trusted-student"
