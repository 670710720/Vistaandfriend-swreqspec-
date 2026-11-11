from app.profile_update import apply_profile_update
from app.sample_profiles import get_sample_owner_profile


def test_AC_ERP_02_accepts_only_editable_fields():
    profile = get_sample_owner_profile()
    result = apply_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles={"student-1001": profile},
        updates={
            "age": 23,
            "phone": "0999999999",
            "is_searchable": True,
            "invalid_field": "skip-me",
        },
    )

    assert result.status == "updated"
    assert result.profile.age == 23
    assert result.profile.phone == "0999999999"
    assert result.profile.is_searchable is True
    assert result.message == "อัปเดตโปรไฟล์สำเร็จ"


def test_AC_ERP_02A_rejects_locked_fields():
    profile = get_sample_owner_profile()
    result = apply_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles={"student-1001": profile},
        updates={
            "name": "นักศึกษา ใหม่",
            "gender": "ชาย",
            "age": 24,
        },
    )

    assert result.status == "rejected"
    assert result.errors["name"] == "ชื่อไม่อนุญาตให้แก้ไข"
    assert result.errors["gender"] == "เพศไม่อนุญาตให้แก้ไข"


def test_AC_ERP_02B_rejects_other_users_status_changes():
    profile = get_sample_owner_profile()
    result = apply_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1002",
        profiles={"student-1001": profile},
        updates={"is_searchable": True},
    )

    assert result.status == "forbidden"
    assert result.profile is None
    assert "ไม่อนุญาต" in result.message
