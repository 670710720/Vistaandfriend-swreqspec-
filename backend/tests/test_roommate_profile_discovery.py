import json
from urllib.parse import quote

from fastapi.testclient import TestClient

from app.config import PROFILE_AGE_MIN, ROOM_OCCUPANCY_LIMITS
from app.main import create_app
from app.models.roommate_profile import RoommateProfile


def _profile_data():
    return {
        "nickname": "เมท",
        "age": str(PROFILE_AGE_MIN),
        "gender": "หญิง",
        "faculty": "วิทยาศาสตร์",
        "academicYear": "1",
        "phone": "0812345678",
        "roomType": "airConditioned",
        "occupants": str(ROOM_OCCUPANCY_LIMITS["airConditioned"]["min"]),
        "sleepBehaviors": ["กรน"],
        "otherSleepBehavior": "",
        "social": {},
    }


def _post_profile(client: TestClient, headers: dict[str, str] | None = None):
    return client.post(
        "/api/roommate-profiles",
        data={"profileData": json.dumps(_profile_data(), ensure_ascii=False)},
        files={"profileImage": ("profile.png", b"image-bytes", "image/png")},
        headers=headers,
    )


def test_AC_RMP_06_owner_can_open_and_close_profile_search_visibility(tmp_path):
    app = create_app(database_url=f"sqlite:///{tmp_path / 'profile-discovery.db'}")

    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        request.state.user_id = request.headers.get("X-Test-User-ID")
        return await call_next(request)

    headers = {"X-Test-User-ID": "student-1"}
    with TestClient(app) as client:
        assert _post_profile(client, headers).status_code == 201

        opened = client.patch(
            "/api/roommate-profiles/me/search-visibility",
            json={"isSearchable": True},
            headers=headers,
        )
        closed = client.patch(
            "/api/roommate-profiles/me/search-visibility",
            json={"isSearchable": False},
            headers=headers,
        )

    assert opened.status_code == 200
    assert opened.json() == {"isSearchable": True}
    assert closed.status_code == 200
    assert closed.json() == {"isSearchable": False}
    with app.state.session_factory() as session:
        profile = session.get(RoommateProfile, "student-1")
    assert profile is not None
    assert profile.is_searchable is False


def test_AC_RMP_06_visibility_update_requires_identity_and_profile(tmp_path):
    app = create_app(database_url=f"sqlite:///{tmp_path / 'profile-discovery-guards.db'}")

    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        user_id = request.headers.get("X-Test-User-ID")
        if user_id:
            request.state.user_id = user_id
        return await call_next(request)

    with TestClient(app) as client:
        unauthenticated = client.patch(
            "/api/roommate-profiles/me/search-visibility",
            json={"isSearchable": True},
        )
        missing_profile = client.patch(
            "/api/roommate-profiles/me/search-visibility",
            json={"isSearchable": True},
            headers={"X-Test-User-ID": "student-without-profile"},
        )
        invalid_value = client.patch(
            "/api/roommate-profiles/me/search-visibility",
            json={"isSearchable": "true"},
            headers={"X-Test-User-ID": "student-without-profile"},
        )

    assert unauthenticated.status_code == 401
    assert missing_profile.status_code == 404
    assert invalid_value.status_code == 422


def test_AC_RMP_08_visibility_update_only_changes_the_authenticated_owner(tmp_path):
    app = create_app(database_url=f"sqlite:///{tmp_path / 'profile-discovery-owner.db'}")

    @app.middleware("http")
    async def inject_test_identity(request, call_next):
        user_id = request.headers.get("X-Test-User-ID")
        if user_id:
            request.state.user_id = user_id
        return await call_next(request)

    with TestClient(app) as client:
        assert _post_profile(client, {"X-Test-User-ID": "student-1"}).status_code == 201
        response = client.patch(
            "/api/roommate-profiles/me/search-visibility",
            json={"isSearchable": True},
            headers={"X-Test-User-ID": "student-2"},
        )

    assert response.status_code == 404
    with app.state.session_factory() as session:
        owner_profile = session.get(RoommateProfile, "student-1")
    assert owner_profile is not None
    assert owner_profile.is_searchable is False


def test_AC_RMP_06_development_demo_identity_can_change_visibility(tmp_path):
    app = create_app(
        database_url=f"sqlite:///{tmp_path / 'profile-discovery-demo.db'}",
        demo_auth_enabled=True,
        runtime_environment="development",
    )
    headers = {"X-Demo-User-ID": quote("demo student", safe="")}

    with TestClient(app) as client:
        assert _post_profile(client, headers).status_code == 201
        response = client.patch(
            "/api/roommate-profiles/me/search-visibility",
            json={"isSearchable": True},
            headers=headers,
        )

    assert response.status_code == 200
    assert response.json() == {"isSearchable": True}
