from app.models.roommate_preference import RoommatePreference
from app.roommate_preferences import RoommatePreferenceStore


def test_T02_roommate_preference_storage_binds_owner_and_keeps_six_fields():
    store = RoommatePreferenceStore()
    preference = RoommatePreference(
        owner_id="student-1",
        room_occupants=2,
        room_type="airConditioned",
        sleep_behavior="กรน",
        cleanliness="สะอาดมาก",
        sleep_time="22:00–00:00",
        additional_text="ไม่ส่งเสียงตอนนอน",
    )

    saved = store.save_for_owner(preference)

    assert saved is preference
    assert store.get_for_owner("student-1") is preference
    assert preference.to_dict() == {
        "owner_id": "student-1",
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "ไม่ส่งเสียงตอนนอน",
    }


def test_T02_roommate_preference_storage_rejects_other_owner_update():
    store = RoommatePreferenceStore()
    original = RoommatePreference(
        owner_id="student-1",
        room_occupants=2,
        room_type="airConditioned",
    )
    store.save_for_owner(original)
    attempted = RoommatePreference(
        owner_id="student-2",
        room_occupants=3,
        room_type="fan",
    )

    try:
        store.update_for_owner("student-1", attempted)
    except PermissionError:
        pass
    else:
        raise AssertionError("ควรปฏิเสธการแก้ไขข้อมูลที่ไม่ใช่เจ้าของ")

    assert store.get_for_owner("student-1") is original


def test_AC_RPS_02_accepts_preference_selection_and_additional_text():
    from app.roommate_preferences import receive_preference_for_owner

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    store = RoommatePreferenceStore()
    payload = {
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "ต้องการห้องเงียบ",
    }

    # When นักศึกษาเลือกหรือกรอกข้อมูลความต้องการ
    preference = receive_preference_for_owner("student-1", payload, store)

    # Then ระบบรับข้อมูลครบทั้ง 6 หัวข้อของนักศึกษา
    assert preference.to_dict() == {
        "owner_id": "student-1",
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "ต้องการห้องเงียบ",
    }
    assert store.get_for_owner("student-1") is preference


def test_AC_RPS_02A_accepts_valid_and_boundary_room_capacity():
    from app.roommate_preferences import validate_room_capacity

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    # When นักศึกษาระบุจำนวนคนและรูปแบบห้อง
    assert validate_room_capacity("airConditioned", 2) is True
    assert validate_room_capacity("fan", 2) is True
    assert validate_room_capacity("airConditioned", 1) is True
    assert validate_room_capacity("airConditioned", 4) is True
    assert validate_room_capacity("fan", 1) is True
    assert validate_room_capacity("fan", 3) is True

    # Then ระบบยอมรับเฉพาะช่วงที่กำหนด
    assert validate_room_capacity("airConditioned", 5) is False
    assert validate_room_capacity("fan", 4) is False


def test_AC_RPS_02B_rejects_incompatible_capacity_without_saving():
    from app.roommate_preferences import receive_preference_for_owner

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    store = RoommatePreferenceStore()
    payload = {
        "room_occupants": 4,
        "room_type": "fan",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "",
    }

    # When นักศึกษาเลือกห้องพัดลม 4 คนแล้วพยายามบันทึก
    try:
        receive_preference_for_owner("student-1", payload, store)
    except ValueError as exc:
        # Then ระบบแจ้งข้อผิดพลาดและไม่อนุญาตบันทึก
        assert str(exc) == "จำนวนคนในห้องไม่สอดคล้องกับรูปแบบห้อง"
    else:
        raise AssertionError("ควรปฏิเสธชุดข้อมูลที่ไม่สอดคล้อง")

    assert store.get_for_owner("student-1") is None


def test_AC_RPS_02C_accepts_additional_text_limit_and_rejects_invalid_text():
    from app.roommate_preferences import receive_preference_for_owner, validate_additional_text

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    assert validate_additional_text(None) is True
    assert validate_additional_text("") is True
    assert validate_additional_text("ก" * 500) is True

    # When นักศึกษากรอกเกิน 500 ตัวอักษรหรือเป็นช่องว่าง
    assert validate_additional_text("ก" * 501) is False
    assert validate_additional_text("   ") is False

    # Then การบันทึกข้อมูลไม่เสร็จและไม่มี record ถูกสร้าง
    store = RoommatePreferenceStore()
    payload = {
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": None,
        "cleanliness": None,
        "sleep_time": None,
        "additional_text": "ก" * 501,
    }
    try:
        receive_preference_for_owner("student-1", payload, store)
    except ValueError as exc:
        assert "ข้อมูลเพิ่มเติม" in str(exc)
    else:
        raise AssertionError("ควรปฏิเสธข้อมูลเพิ่มเติมเกิน 500 ตัวอักษร")
    assert store.get_for_owner("student-1") is None


def test_AC_RPS_03_rejects_missing_required_fields_without_saving():
    from app.roommate_preferences import receive_preference_for_owner, validate_required_preference_fields

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    store = RoommatePreferenceStore()

    # When นักศึกษายืนยันโดยไม่มีจำนวนคนและรูปแบบห้อง
    empty_payload = {"room_type": "", "room_occupants": None}
    assert validate_required_preference_fields(empty_payload) == [
        "room_type",
        "room_occupants",
    ]
    try:
        receive_preference_for_owner("student-1", empty_payload, store)
    except ValueError as exc:
        assert "ข้อมูลที่จำเป็น" in str(exc)
    else:
        raise AssertionError("ควรปฏิเสธเมื่อไม่มีข้อมูลจำเป็น")

    # When เว้นข้อมูลจำเป็นไว้หนึ่งรายการ
    missing_occupants = {"room_type": "airConditioned", "room_occupants": None}
    assert validate_required_preference_fields(missing_occupants) == ["room_occupants"]

    # Then ระบบไม่บันทึกข้อมูลความต้องการ
    assert store.get_for_owner("student-1") is None


def test_AC_RPS_04_saves_valid_preference_and_boundary_limits():
    from app.roommate_preferences import save_validated_preference_for_owner

    # Given นักศึกษาระบุข้อมูลความต้องการครบแล้ว
    store = RoommatePreferenceStore()
    air_payload = {
        "room_type": "airConditioned",
        "room_occupants": 4,
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "",
    }

    # When นักศึกษากดยืนยัน
    saved_air = save_validated_preference_for_owner("student-air", air_payload, store)

    # Then ระบบบันทึกข้อมูลสำหรับเจ้าของและรับค่าขอบเขต
    assert store.get_for_owner("student-air") is saved_air
    assert saved_air.room_occupants == 4
    assert saved_air.room_type == "airConditioned"

    fan_payload = dict(air_payload)
    fan_payload["room_type"] = "fan"
    fan_payload["room_occupants"] = 3
    saved_fan = save_validated_preference_for_owner("student-fan", fan_payload, store)
    assert store.get_for_owner("student-fan") is saved_fan
    assert saved_fan.room_occupants == 3
