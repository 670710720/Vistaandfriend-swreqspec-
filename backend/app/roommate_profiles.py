"""Validation helpers for FR-RMP-05, FR-RMP-06, FR-RMP-07, and CON-VALID-01."""

import re
from collections.abc import Mapping

from starlette.datastructures import UploadFile

from app.config import (
    PROFILE_AGE_MAX,
    PROFILE_AGE_MIN,
    PROFILE_FACULTIES,
    PROFILE_GENDERS,
    PROFILE_IMAGE_FORMATS,
    PROFILE_IMAGE_MAX_BYTES,
    PROFILE_IMAGE_MAX_MB,
    PROFILE_PHONE_DIGITS,
    PROFILE_PHONE_SEPARATORS,
    PROFILE_REQUIRED_FIELDS,
    PROFILE_YEAR_OPTIONS,
    ROOM_OCCUPANCY_LIMITS,
    SLEEP_BEHAVIOR_OPTIONS,
    SLEEP_MIN_SELECTIONS,
    SLEEP_NONE_EXCLUSIVE,
    SLEEP_OTHER_REQUIRES_DESCRIPTION,
)


def _parse_integer(value: object) -> int | None:
    """Parse integer form values without accepting booleans or fractional values (CON-VALID-01)."""
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str) and re.fullmatch(r"[0-9]+", value):
        return int(value)
    return None


def _is_valid_image(value: object) -> bool:
    """Check multipart image metadata against FR-RMP-03 and CON-VALID-01."""
    if not isinstance(value, UploadFile):
        return False
    if value.content_type not in PROFILE_IMAGE_FORMATS:
        return False
    if value.size is None or value.size > PROFILE_IMAGE_MAX_BYTES:
        return False
    return True


def validate_profile_payload(values: Mapping[str, object]) -> dict[str, str]:
    """Validate inputs before persistence (FR-RMP-05/06/07, CON-DATA-01, CON-VALID-01, CON-ROOM-01)."""
    errors: dict[str, str] = {}

    for field in PROFILE_REQUIRED_FIELDS:
        value = values.get(field)
        if field == "profileImage":
            if value is None:
                errors[field] = "กรุณาเลือกรูปโปรไฟล์"
        elif value is None or (isinstance(value, str) and not value.strip()):
            errors[field] = "กรุณากรอกข้อมูลให้ครบถ้วน"

    age = _parse_integer(values.get("age"))
    if "age" not in errors:
        if age is None or not PROFILE_AGE_MIN <= age <= PROFILE_AGE_MAX:
            errors["age"] = (
                f"อายุต้องเป็นจำนวนเต็มระหว่าง {PROFILE_AGE_MIN}–{PROFILE_AGE_MAX} ปี"
            )

    gender = values.get("gender")
    if "gender" not in errors and gender not in PROFILE_GENDERS:
        errors["gender"] = "กรุณาเลือกเพศจากรายการที่กำหนด"

    faculty = values.get("faculty")
    if "faculty" not in errors and faculty not in PROFILE_FACULTIES:
        errors["faculty"] = "กรุณาเลือกคณะจากรายการที่กำหนด"

    academic_year = values.get("academicYear")
    if "academicYear" not in errors and academic_year not in PROFILE_YEAR_OPTIONS:
        errors["academicYear"] = "กรุณาเลือกชั้นปีจากรายการที่กำหนด"

    profile_image = values.get("profileImage")
    if "profileImage" not in errors and not _is_valid_image(profile_image):
        errors["profileImage"] = (
            "รูปโปรไฟล์ต้องเป็น JPG หรือ PNG และมีขนาดไม่เกิน "
            f"{PROFILE_IMAGE_MAX_MB} MB"
        )

    phone = values.get("phone")
    if "phone" not in errors:
        phone_value = str(phone)
        for separator in PROFILE_PHONE_SEPARATORS:
            phone_value = phone_value.replace(separator, "")
        if not phone_value.isascii() or not phone_value.isdigit() or len(phone_value) != PROFILE_PHONE_DIGITS:
            errors["phone"] = (
                f"เบอร์โทรศัพท์ต้องมีตัวเลข {PROFILE_PHONE_DIGITS} หลัก"
            )

    room_type = values.get("roomType")
    occupancy_rule = ROOM_OCCUPANCY_LIMITS.get(room_type) if isinstance(room_type, str) else None
    if "roomType" not in errors and occupancy_rule is None:
        errors["roomType"] = "กรุณาเลือกรูปแบบห้องพักจากรายการที่กำหนด"

    occupants = _parse_integer(values.get("occupants"))
    if "occupants" not in errors:
        if occupants is None or occupancy_rule is None or not (
            occupancy_rule["min"] <= occupants <= occupancy_rule["max"]
        ):
            errors["occupants"] = "จำนวนผู้พักไม่สอดคล้องกับรูปแบบห้อง"

    sleep_behaviors = values.get("sleepBehaviors")
    if "sleepBehaviors" not in errors:
        if not isinstance(sleep_behaviors, (list, tuple)):
            errors["sleepBehaviors"] = "กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ"
        elif len(sleep_behaviors) < SLEEP_MIN_SELECTIONS:
            errors["sleepBehaviors"] = "กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ"
        elif any(item not in SLEEP_BEHAVIOR_OPTIONS for item in sleep_behaviors):
            errors["sleepBehaviors"] = "กรุณาเลือกพฤติกรรมการนอนจากรายการที่กำหนด"
        elif SLEEP_NONE_EXCLUSIVE in sleep_behaviors and len(sleep_behaviors) > 1:
            errors["sleepBehaviors"] = 'ไม่สามารถเลือก "ไม่มีพฤติกรรมดังกล่าว" ร่วมกับรายการอื่นได้'

    if (
        "sleepBehaviors" not in errors
        and isinstance(sleep_behaviors, (list, tuple))
        and SLEEP_OTHER_REQUIRES_DESCRIPTION in sleep_behaviors
    ):
        description = values.get("otherSleepBehavior")
        if not isinstance(description, str) or not description.strip():
            errors["otherSleepBehavior"] = "กรุณาระบุพฤติกรรมการนอนเพิ่มเติม"

    return errors
