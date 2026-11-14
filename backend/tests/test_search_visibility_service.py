from app.profile_service import save_profile_update
from app.search_visibility_service import get_visible_profiles, is_profile_search_visible
from app.sample_profiles import get_sample_owner_profile


def test_AC_ERP_04_updates_profile_and_search_visibility_on_success():
    profile = get_sample_owner_profile()
    profiles = {"student-1001": profile}

    result = save_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles=profiles,
        updates={
            "age": 24,
            "phone": "0999999999",
            "roomType": "fan",
            "occupants": 2,
            "sleepBehaviors": ["กรน"],
            "isSearchable": True,
        },
    )

    assert result.status == "updated"
    assert result.profile.is_searchable is True
    assert is_profile_search_visible(result.profile) is True
    assert profiles["student-1001"].is_searchable is True
    assert get_visible_profiles(profiles) == [profiles["student-1001"]]


def test_AC_ERP_07_profile_becomes_searchable_immediately():
    profile = get_sample_owner_profile()
    profiles = {"student-1001": profile}

    result = save_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles=profiles,
        updates={"isSearchable": True},
    )

    assert result.status == "updated"
    assert is_profile_search_visible(result.profile) is True
    assert get_visible_profiles(profiles)[0].user_id == "student-1001"


def test_AC_ERP_07A_profile_hides_from_search_when_not_searchable():
    profile = get_sample_owner_profile()
    profile = profile
    profiles = {"student-1001": profile}

    result = save_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles=profiles,
        updates={"isSearchable": False},
    )

    assert result.status == "updated"
    assert is_profile_search_visible(result.profile) is False
    assert get_visible_profiles(profiles) == []
