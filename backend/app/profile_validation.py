from __future__ import annotations

# รองรับ FR-ERP-03, FR-ERP-04, FR-ERP-05, FR-ERP-06, CON-ERP-03, CON-ERP-04, CON-ERP-05, CON-ERP-06
PROFILE_EDITABLE_FIELDS = [
    "age",
    "faculty",
    "academicYear",
    "profileImage",
    "phone",
    "roomType",
    "occupants",
    "sleepBehaviors",
    "otherSleepBehavior",
    "isSearchable",
]
PROFILE_LOCKED_FIELDS = ["name", "gender"]

VALID_FACULTIES = {
    "วิทยาศาสตร์",
    "เภสัชศาสตร์",
    "วิศวกรรมศาสตร์",
    "อักษรศาสตร์",
    "มัณฑนศิลป์",
    "ศิลปกรรม",
    "ศึกษาศาสตร์",
    "จิตรกรรม",
}
VALID_ACADEMIC_YEARS = {"1", "2", "3", "4", "5 ขึ้นไป"}
VALID_SLEEP_BEHAVIORS = {"กรน", "กัดฟัน", "นอนดิ้น", "ไม่มีพฤติกรรมดังกล่าว", "อื่น ๆ"}
ROOM_OCCUPANT_RULES = {
    "airConditioned": {"min": 1, "max": 4},
    "fan": {"min": 1, "max": 3},
}


def _as_list(value):
    if value is None:
        return []
    if isinstance(value, (list, tuple, set)):
        return list(value)
    return [value]


def _normalize_file(value):
    if value is None:
        return {"type": None, "size": 0}
    if isinstance(value, dict):
        return {"type": value.get("type"), "size": value.get("size", 0)}
    return {"type": getattr(value, "type", None), "size": getattr(value, "size", 0)}


def _normalize_room_type(value):
    if value is None:
        return None
    room_type = str(value).strip()
    if room_type in {"ห้องแอร์", "airConditioned"}:
        return "airConditioned"
    if room_type in {"ห้องพัดลม", "fan"}:
        return "fan"
    return room_type


def _normalize_academic_year(value):
    if value is None:
        return None
    academic_year = str(value).strip()
    mapping = {
        "ชั้นปีที่ 1": "1",
        "ชั้นปีที่ 2": "2",
        "ชั้นปีที่ 3": "3",
        "ชั้นปีที่ 4": "4",
        "ชั้นปีที่ 5": "5 ขึ้นไป",
        "5 ขึ้นไป": "5 ขึ้นไป",
    }
    return mapping.get(academic_year, academic_year)


def validate_profile_save(current_values, updates):
    """Validate the final payload before committing a profile edit without mutating the original values."""
    payload = {
        "name": None,
        "gender": None,
        "age": current_values.get("age"),
        "faculty": current_values.get("faculty"),
        "academicYear": current_values.get("academicYear", current_values.get("academic_year")),
        "profileImage": current_values.get("profileImage", current_values.get("profile_image")),
        "phone": current_values.get("phone"),
        "roomType": current_values.get("roomType", current_values.get("room_type")),
        "occupants": current_values.get("occupants", current_values.get("room_occupants")),
        "sleepBehaviors": current_values.get("sleepBehaviors", current_values.get("sleep_behaviors")),
        "otherSleepBehavior": current_values.get("otherSleepBehavior", current_values.get("other_sleep_behavior")),
        "isSearchable": current_values.get("isSearchable", current_values.get("is_searchable")),
    }
    for key, value in updates.items():
        payload[key] = value
    return validate_edit_profile(payload)


def validate_edit_profile(values):
    """Validate the editable fields for an edit roommate profile request."""
    errors = {}

    if values.get("name") not in (None, ""):
        errors["name"] = "ชื่อไม่อนุญาตให้แก้ไข"
    if values.get("gender") not in (None, ""):
        errors["gender"] = "เพศไม่อนุญาตให้แก้ไข"

    required_fields = [
        "age",
        "faculty",
        "academicYear",
        "profileImage",
        "phone",
        "roomType",
        "occupants",
        "sleepBehaviors",
    ]
    for field in required_fields:
        value = values.get(field)
        if field == "sleepBehaviors":
            if not _as_list(value):
                errors[field] = "กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ"
            continue
        if value in (None, ""):
            errors[field] = "กรุณากรอกข้อมูลให้ครบถ้วน"

    age = values.get("age")
    if age not in (None, ""):
        try:
            age_value = int(age)
        except (TypeError, ValueError):
            errors["age"] = "อายุต้องเป็นตัวเลขจำนวนเต็ม"
        else:
            if age_value < 18 or age_value > 25:
                errors["age"] = "อายุต้องอยู่ระหว่าง 18–25 ปี"

    faculty = values.get("faculty")
    if faculty not in (None, "") and str(faculty) not in VALID_FACULTIES:
        errors["faculty"] = "กรุณาเลือกคณะจากรายการที่กำหนด"

    academic_year = _normalize_academic_year(values.get("academicYear"))
    if academic_year not in (None, "") and str(academic_year) not in VALID_ACADEMIC_YEARS:
        errors["academicYear"] = "กรุณาเลือกชั้นปีจากรายการที่กำหนด"

    profile_image = _normalize_file(values.get("profileImage"))
    file_type = profile_image.get("type")
    file_size = profile_image.get("size") or 0
    if profile_image.get("type"):
        if file_type not in {"image/jpeg", "image/png"}:
            errors["profileImage"] = "รูปโปรไฟล์ต้องเป็นไฟล์ JPG หรือ PNG"
        elif file_size > 5 * 1024 * 1024:
            errors["profileImage"] = "รูปโปรไฟล์ต้องมีขนาดไม่เกิน 5 MB"

    phone = values.get("phone")
    if phone not in (None, ""):
        digits = str(phone).replace(" ", "").replace("-", "")
        if not digits.isdigit() or len(digits) != 10:
            errors["phone"] = "เบอร์โทรศัพท์ต้องมีตัวเลข 10 หลัก"

    room_type = _normalize_room_type(values.get("roomType"))
    occupants = values.get("occupants")
    if room_type and occupants not in (None, ""):
        try:
            occupant_count = int(occupants)
        except (TypeError, ValueError):
            errors["occupants"] = "จำนวนผู้พักต้องเป็นตัวเลข"
        else:
            rule = ROOM_OCCUPANT_RULES.get(room_type)
            if rule and (occupant_count < rule["min"] or occupant_count > rule["max"]):
                errors["occupants"] = "จำนวนผู้พักไม่สอดคล้องกับรูปแบบห้อง"

    sleep_behaviors = _as_list(values.get("sleepBehaviors"))
    if sleep_behaviors:
        sleep_set = {str(item) for item in sleep_behaviors}
        if "อื่น ๆ" in sleep_set and not str(values.get("otherSleepBehavior", "")).strip():
            errors["otherSleepBehavior"] = "กรุณาระบุพฤติกรรมการนอนเพิ่มเติม"
        if not sleep_set.issubset(VALID_SLEEP_BEHAVIORS):
            invalid_behaviors = sorted(sleep_set - VALID_SLEEP_BEHAVIORS)
            if invalid_behaviors:
                errors["sleepBehaviors"] = "พฤติกรรมการนอนมีค่าไม่ถูกต้อง"

    return errors
