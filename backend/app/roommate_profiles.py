"""Validation helpers for FR-RMP-05, FR-RMP-06, FR-RMP-07, and CON-VALID-01."""

import json
import re
from collections.abc import Generator, Mapping

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile as FastAPIUploadFile,
)
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from app.controllers.chat_controller import get_authenticated_user_id
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
    PROFILE_SOCIAL_CHANNELS,
    PROFILE_YEAR_OPTIONS,
    ROOM_OCCUPANCY_LIMITS,
    SLEEP_BEHAVIOR_OPTIONS,
    SLEEP_MIN_SELECTIONS,
    SLEEP_NONE_EXCLUSIVE,
    SLEEP_OTHER_REQUIRES_DESCRIPTION,
)
from app.models.roommate_profile import RoommateProfile

router = APIRouter()


class ProfileValidationError(ValueError):
    """Expose field-level create validation errors (FR-RMP-05/06/07)."""

    def __init__(self, errors: dict[str, str]) -> None:
        self.errors = errors
        super().__init__("Profile data failed validation")


class ProfileAlreadyExistsError(ValueError):
    """Prevent a second profile for the same owner (CON-PROFILE-01)."""


class ProfilePersistenceError(RuntimeError):
    """Report failed atomic persistence without exposing database details (CON-REL-01, NFR-REL-01)."""


def get_profile_db(request: Request) -> Generator[Session, None, None]:
    """Provide the configured application session for FR-RMP-08 and CON-DATA-01."""
    db = request.app.state.session_factory()
    try:
        yield db
    finally:
        db.close()


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

    nickname = values.get("nickname")
    if "nickname" not in errors and not isinstance(nickname, str):
        errors["nickname"] = "กรุณากรอกชื่อเล่นเป็นข้อความ"

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
        if not isinstance(phone, str):
            errors["phone"] = (
                f"เบอร์โทรศัพท์ต้องมีตัวเลข {PROFILE_PHONE_DIGITS} หลัก"
            )
        else:
            phone_value = phone
            for separator in PROFILE_PHONE_SEPARATORS:
                phone_value = phone_value.replace(separator, "")
            if (
                not phone_value.isascii()
                or not phone_value.isdigit()
                or len(phone_value) != PROFILE_PHONE_DIGITS
            ):
                errors["phone"] = (
                    f"เบอร์โทรศัพท์ต้องมีตัวเลข {PROFILE_PHONE_DIGITS} หลัก"
                )

    other_sleep_behavior = values.get("otherSleepBehavior")
    if other_sleep_behavior is not None and not isinstance(other_sleep_behavior, str):
        errors["otherSleepBehavior"] = "กรุณาระบุพฤติกรรมการนอนเพิ่มเติม"

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


def save_roommate_profile(
    db: Session,
    owner_id: str,
    values: Mapping[str, object],
) -> RoommateProfile:
    """Persist validated profile data atomically (FR-RMP-08/11, CON-REL-01, CON-DISCOVER-01, NFR-REL-01)."""
    errors = validate_profile_payload(values)
    if errors:
        raise ProfileValidationError(errors)

    if db.get(RoommateProfile, owner_id) is not None:
        db.rollback()
        raise ProfileAlreadyExistsError("นักศึกษามีโปรไฟล์หาเมทอยู่แล้ว")

    age = _parse_integer(values["age"])
    occupants = _parse_integer(values["occupants"])
    profile_image = values["profileImage"]
    sleep_behaviors = values["sleepBehaviors"]
    if (
        age is None
        or occupants is None
        or not isinstance(profile_image, UploadFile)
        or not isinstance(sleep_behaviors, (list, tuple))
    ):
        raise ProfileValidationError({"profile": "ข้อมูลโปรไฟล์ไม่ถูกต้อง"})

    nickname = values.get("nickname")
    gender = values.get("gender")
    faculty = values.get("faculty")
    academic_year = values.get("academicYear")
    phone = values.get("phone")
    room_type = values.get("roomType")
    other_sleep_behavior = values.get("otherSleepBehavior")
    if (
        not isinstance(nickname, str)
        or not isinstance(gender, str)
        or not isinstance(faculty, str)
        or not isinstance(academic_year, str)
        or not isinstance(phone, str)
        or not isinstance(room_type, str)
        or (other_sleep_behavior is not None and not isinstance(other_sleep_behavior, str))
    ):
        raise ProfileValidationError({"profile": "ข้อมูลโปรไฟล์ไม่ถูกต้อง"})

    social_values = values.get("social")
    if social_values is not None and not isinstance(social_values, Mapping):
        raise ProfileValidationError({"social": "ข้อมูลโซเชียลไม่ถูกต้อง"})

    social_fields: dict[str, str | None] = {}
    for channel in PROFILE_SOCIAL_CHANNELS:
        field_name = channel.lower()
        social_value = (
            social_values.get(channel)
            if isinstance(social_values, Mapping)
            else values.get(field_name)
        )
        if social_value is not None and not isinstance(social_value, str):
            raise ProfileValidationError({field_name: "ข้อมูลโซเชียลต้องเป็นข้อความ"})
        social_fields[field_name] = social_value

    try:
        profile_image.file.seek(0)
        image_bytes = profile_image.file.read()
        profile_image.file.seek(0)
    except OSError as error:
        db.rollback()
        raise ProfilePersistenceError("ไม่สามารถอ่านรูปโปรไฟล์ได้") from error

    profile = RoommateProfile(
        user_id=owner_id,
        nickname=nickname,
        age=age,
        gender=gender,
        faculty=faculty,
        academic_year=academic_year,
        profile_image=image_bytes,
        phone=phone,
        facebook=social_fields["facebook"],
        instagram=social_fields["instagram"],
        line=social_fields["line"],
        tiktok=social_fields["tiktok"],
        room_type=room_type,
        room_occupants=occupants,
        sleep_behaviors=list(sleep_behaviors),
        other_sleep_behavior=other_sleep_behavior,
    )

    try:
        db.add(profile)
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise ProfilePersistenceError("ไม่สามารถบันทึกโปรไฟล์ได้ กรุณาลองใหม่") from error

    return profile


@router.post("/api/roommate-profiles", status_code=201)
def create_roommate_profile(
    profile_data: str = Form(..., alias="profileData"),
    profile_image: FastAPIUploadFile = File(..., alias="profileImage"),
    db: Session = Depends(get_profile_db),
    owner_id: str = Depends(get_authenticated_user_id),
) -> JSONResponse:
    """Create a profile only for trusted identity context (CON-AUTH-01, FR-RMP-08/09)."""
    try:
        payload_data = json.loads(profile_data)
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=422,
            content={"errors": {"profileData": "ข้อมูลโปรไฟล์ไม่ถูกต้อง"}},
        )
    if not isinstance(payload_data, dict):
        return JSONResponse(
            status_code=422,
            content={"errors": {"profileData": "ข้อมูลโปรไฟล์ไม่ถูกต้อง"}},
        )

    values: dict[str, object] = dict(payload_data)
    values["profileImage"] = profile_image
    try:
        save_roommate_profile(db, owner_id=owner_id, values=values)
    except ProfileValidationError as error:
        return JSONResponse(status_code=422, content={"errors": error.errors})
    except ProfileAlreadyExistsError as error:
        return JSONResponse(
            status_code=409,
            content={"errors": {"profile": str(error)}},
        )
    except ProfilePersistenceError:
        raise HTTPException(
            status_code=503,
            detail={"errors": {"profile": "ไม่สามารถบันทึกโปรไฟล์ได้ กรุณาลองใหม่"}},
        )

    return JSONResponse(
        status_code=201,
        content={"message": "สร้างโปรไฟล์สำเร็จ"},
    )


@router.get("/api/roommate-profiles/me")
def get_current_roommate_profile_status(
    db: Session = Depends(get_profile_db),
    owner_id: str = Depends(get_authenticated_user_id),
) -> dict[str, bool]:
    """Check current owner's profile before opening the form (FR-RMP-01/02, CON-AUTH-01, CON-PROFILE-01)."""
    return {"hasProfile": db.get(RoommateProfile, owner_id) is not None}
