from fastapi.testclient import TestClient

from app.api.profile_detail import app as detail_app
from app.api.search import app
from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService


client = TestClient(app)
detail_client = TestClient(detail_app)


def test_AC_SRS_03A_excludes_closed_profiles_and_current_user():
    response = client.post(
        "/search-roommates",
        json={
            "current_user_id": "user-1",
            "filters": {"gender": "หญิง", "faculty": "วิศวกรรมศาสตร์"},
            "mode": "AND",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert [item["user_id"] for item in payload] == ["user-2"]
    assert all(item["user_id"] != "user-1" for item in payload)
    assert all(item["is_open_for_search"] is True for item in payload)


def test_AC_SRS_03B_keeps_only_open_profiles_when_there_are_no_filters():
    response = client.post(
        "/search-roommates",
        json={
            "current_user_id": "user-1",
            "filters": {},
            "mode": "AND",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert [item["user_id"] for item in payload] == ["user-2", "user-4"]
    assert all(item["is_open_for_search"] is True for item in payload)
    assert all(item["user_id"] != "user-1" for item in payload)


def test_AC_SRS_03C_uses_and_mode_and_ranks_by_match_count():
    response = client.post(
        "/search-roommates",
        json={
            "current_user_id": "user-1",
            "filters": {"gender": "หญิง", "room_type": "ห้องแยก", "faculty": "วิศวกรรมศาสตร์"},
            "mode": "AND",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert [item["user_id"] for item in payload] == ["user-2"]


def test_AC_SRS_03C_uses_or_mode_and_orders_by_most_matches():
    response = client.post(
        "/search-roommates",
        json={
            "current_user_id": "user-1",
            "filters": {"gender": "หญิง", "room_type": "ห้องแยก", "faculty": "วิศวกรรมศาสตร์"},
            "mode": "OR",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert [item["user_id"] for item in payload] == ["user-2", "user-4"]
    assert payload[0]["user_id"] == "user-2"
    assert payload[1]["user_id"] == "user-4"


def test_AC_SRS_03D_prefers_match_values_from_roommate_preferences():
    response = client.post(
        "/search-roommates",
        json={
            "current_user_id": "user-1",
            "filters": {"sleep_behavior": "กรน", "cleanliness": "สะอาด"},
            "mode": "AND",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert [item["user_id"] for item in payload] == ["user-2"]


def test_AC_SRS_03D_matches_roommate_sleep_time_from_preference_data():
    response = client.post(
        "/search-roommates",
        json={
            "current_user_id": "user-1",
            "filters": {"sleep_time": "22:30"},
            "mode": "AND",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert [item["user_id"] for item in payload] == ["user-2"]


def test_AC_SRS_03E_starts_new_searches_on_page_1_and_caps_page_size():
    profiles = [
        SearchRoommateProfile(
            user_id=f"user-{index}",
            name=f"ผู้ใช้ {index}",
            age=20 + (index % 5),
            gender="หญิง" if index % 2 == 0 else "ชาย",
            faculty="วิศวกรรมศาสตร์",
            academic_year=str(index % 4 + 1),
            room_type="ห้องแยก",
            room_size=2,
            is_open_for_search=True,
            sleep_behavior="กรน",
            cleanliness="สะอาด",
            sleep_time="23:00",
        )
        for index in range(2, 32)
    ]
    service = SearchRoommateService(profiles=profiles)

    first_page = service.query_roommates("user-1", filters={}, page=1)
    second_page = service.query_roommates("user-1", filters={}, page=2)

    assert len(first_page) == 20
    assert len(second_page) == 10
    assert first_page[0].user_id == "user-2"
    assert second_page[0].user_id == "user-22"
    assert service.query_roommates("user-1", filters={}) == first_page


def test_AC_SRS_04_opens_profile_detail_with_allowed_fields_only():
    response = detail_client.get(
        "/profile-detail/user-2",
        params={"current_user_id": "user-1"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["user_id"] == "user-2"
    assert payload["name"] == "น้องแอปเปิล"
    assert payload["social_links"] == {"Facebook": "fb-user-2", "Instagram": "ig-user-2"}
    assert payload["phone_number"] is None
    assert payload["faculty"] == "วิศวกรรมศาสตร์"


def test_AC_SRS_06_rejects_search_requests_without_authenticated_user():
    response = client.post(
        "/search-roommates",
        json={
            "current_user_id": "",
            "filters": {"gender": "หญิง"},
            "mode": "AND",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required to search for roommates."
