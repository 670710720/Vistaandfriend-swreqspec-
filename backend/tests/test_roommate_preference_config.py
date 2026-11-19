from app.config import ROOMMATE_PREFERENCE_CONFIG


def test_T01_roommate_preference_config_matches_spec_rules():
    occupants = ROOMMATE_PREFERENCE_CONFIG["roomOccupants"]

    assert occupants["airConditioned"] == {"min": 1, "max": 4}
    assert occupants["fan"] == {"min": 1, "max": 3}
    assert ROOMMATE_PREFERENCE_CONFIG["sleepBehaviors"] == [
        "กรน",
        "กัดฟัน",
        "นอนดิ้น",
        "ไม่มีพฤติกรรมดังกล่าว",
    ]
    assert ROOMMATE_PREFERENCE_CONFIG["cleanliness"] == [
        "สะอาดมาก",
        "ปานกลาง",
        "ยืดหยุ่น",
    ]
    assert ROOMMATE_PREFERENCE_CONFIG["sleepTime"] == [
        "ก่อน 22:00",
        "22:00–00:00",
        "หลัง 00:00",
        "ยืดหยุ่น",
    ]
    assert ROOMMATE_PREFERENCE_CONFIG["additionalText"]["maxLength"] == 500
