from app.profile_validation import validate_edit_profile


def test_validate_edit_profile_accepts_valid_edit_data():
    values = {
        "age": 22,
        "faculty": "วิศวกรรมศาสตร์",
        "academicYear": "3",
        "profileImage": {"type": "image/png", "size": 2 * 1024 * 1024},
        "phone": "0812345678",
        "roomType": "airConditioned",
        "occupants": 2,
        "sleepBehaviors": ["กรน", "นอนดิ้น"],
        "otherSleepBehavior": "",
    }

    assert validate_edit_profile(values) == {}


def test_validate_edit_profile_rejects_locked_fields_and_missing_sleep_behavior():
    values = {
        "name": "นักศึกษา A",
        "gender": "หญิง",
        "age": 17,
        "faculty": "วิศวกรรมศาสตร์",
        "academicYear": "2",
        "profileImage": {"type": "image/png", "size": 2 * 1024 * 1024},
        "phone": "0812345678",
        "roomType": "fan",
        "occupants": 0,
        "sleepBehaviors": [],
        "otherSleepBehavior": "",
    }

    errors = validate_edit_profile(values)

    assert errors["name"] == "ชื่อไม่อนุญาตให้แก้ไข"
    assert errors["gender"] == "เพศไม่อนุญาตให้แก้ไข"
    assert errors["age"] == "อายุต้องอยู่ระหว่าง 18–25 ปี"
    assert errors["sleepBehaviors"] == "กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ"
    assert errors["occupants"] == "จำนวนผู้พักไม่สอดคล้องกับรูปแบบห้อง"
