import pytest

from app.profile_model import RoommateProfile
from app.profile_service import ProfileAccessResult, load_profile_for_user
from app.sample_profiles import get_sample_profile_set


def test_AC_ERP_01_loads_current_profile_for_logged_in_user():
    result = load_profile_for_user(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles=get_sample_profile_set(),
    )

    assert isinstance(result, ProfileAccessResult)
    assert result.status == "ok"
    assert result.profile is not None
    assert result.profile.user_id == "student-1001"
    assert result.redirect_to_create is False


def test_AC_ERP_06_missing_profile_redirects_to_create_profile():
    result = load_profile_for_user(
        current_user_id="student-404",
        target_user_id="student-404",
        profiles={},
    )

    assert result.status == "missing_profile"
    assert result.profile is None
    assert result.redirect_to_create is True
    assert "ยังไม่มีโปรไฟล์" in result.message


def test_AC_ERP_05_denies_access_to_other_users_profile():
    result = load_profile_for_user(
        current_user_id="student-1001",
        target_user_id="student-1002",
        profiles=get_sample_profile_set(),
    )

    assert result.status == "forbidden"
    assert result.profile is None
    assert result.redirect_to_create is False
    assert "ไม่อนุญาต" in result.message
