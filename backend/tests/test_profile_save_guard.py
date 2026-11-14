from app.profile_service import save_profile_update
from app.sample_profiles import get_sample_owner_profile


def test_AC_ERP_03_rejects_invalid_profile_before_save():
    profile = get_sample_owner_profile()
    profiles = {"student-1001": profile}

    result = save_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles=profiles,
        updates={
            "age": 17,
            "phone": "123",
            "roomType": "fan",
            "occupants": 0,
            "sleepBehaviors": [],
        },
    )

    assert result.status == "rejected"
    assert result.profile is None
    assert result.errors["age"] == "อายุต้องอยู่ระหว่าง 18–25 ปี"
    assert result.errors["sleepBehaviors"] == "กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ"
    assert profiles["student-1001"].age == 22


def test_AC_ERP_04A_keeps_original_profile_when_save_fails():
    profile = get_sample_owner_profile()
    profiles = {"student-1001": profile}

    def failing_save(updated_profile):
        raise RuntimeError("save failed")

    result = save_profile_update(
        current_user_id="student-1001",
        target_user_id="student-1001",
        profiles=profiles,
        updates={"age": 24, "phone": "0999999999", "roomType": "fan", "occupants": 2, "sleepBehaviors": ["กรน"]},
        save_callback=failing_save,
    )

    assert result.status == "save_failed"
    assert result.profile is None
    assert profiles["student-1001"].age == 22
    assert profiles["student-1001"].phone == "0812345678"
