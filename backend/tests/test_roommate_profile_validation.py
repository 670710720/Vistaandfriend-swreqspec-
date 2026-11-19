from io import BytesIO

import pytest
from starlette.datastructures import UploadFile

from app.config import (
    PROFILE_AGE_MIN,
    PROFILE_IMAGE_MAX_BYTES,
    ROOM_OCCUPANCY_LIMITS,
)
from app.roommate_profiles import validate_profile_payload


def _valid_profile(**overrides):
    # AC-RMP-02A: prepare a profile with all required fields and valid values.
    values = {
        "nickname": "เมท",
        "age": str(PROFILE_AGE_MIN),
        "gender": "หญิง",
        "faculty": "วิทยาศาสตร์",
        "academicYear": "1",
        "profileImage": UploadFile(
            file=BytesIO(b"image-data"),
            size=PROFILE_IMAGE_MAX_BYTES,
            filename="profile.png",
            headers={"content-type": "image/png"},
        ),
        "phone": "081 234-5678",
        "roomType": "airConditioned",
        "occupants": str(ROOM_OCCUPANCY_LIMITS["airConditioned"]["min"]),
        "sleepBehaviors": ["กรน"],
        "otherSleepBehavior": "",
    }
    values.update(overrides)
    return values


def test_AC_RMP_02A_accepts_valid_profile_at_image_size_limit():
    assert validate_profile_payload(_valid_profile()) == {}


def test_AC_RMP_03_rejects_missing_required_fields_and_missing_other_description():
    missing_profile = _valid_profile(nickname=" ")
    assert "nickname" in validate_profile_payload(missing_profile)

    missing_description = _valid_profile(
        sleepBehaviors=["อื่น ๆ"],
        otherSleepBehavior=" ",
    )
    assert "otherSleepBehavior" in validate_profile_payload(missing_description)


def test_AC_RMP_04_rejects_invalid_profile_values_and_oversized_image():
    oversized_image = UploadFile(
        file=BytesIO(b"image-data"),
        size=PROFILE_IMAGE_MAX_BYTES + 1,
        filename="profile.png",
        headers={"content-type": "image/png"},
    )
    errors = validate_profile_payload(
        _valid_profile(
            age=f"{PROFILE_AGE_MIN}.5",
            gender="อื่น",
            faculty="คณะอื่น",
            academicYear="6",
            profileImage=oversized_image,
            phone="081234567",
            sleepBehaviors=["พฤติกรรมที่ไม่อยู่ในรายการ"],
        )
    )

    assert "age" in errors
    assert "gender" in errors
    assert "faculty" in errors
    assert "academicYear" in errors
    assert "profileImage" in errors
    assert "phone" in errors
    assert "sleepBehaviors" in errors


def test_AC_RMP_04_rejects_unsupported_profile_image_type():
    unsupported_image = UploadFile(
        file=BytesIO(b"image-data"),
        size=1,
        filename="profile.gif",
        headers={"content-type": "image/gif"},
    )

    errors = validate_profile_payload(
        _valid_profile(profileImage=unsupported_image)
    )

    assert "profileImage" in errors


@pytest.mark.parametrize(
    ("room_type", "occupants"),
    [
        (
            "fan",
            str(ROOM_OCCUPANCY_LIMITS["fan"]["min"] - 1),
        ),
        (
            "fan",
            str(ROOM_OCCUPANCY_LIMITS["fan"]["max"] + 1),
        ),
        (
            "airConditioned",
            str(ROOM_OCCUPANCY_LIMITS["airConditioned"]["max"] + 1),
        ),
    ],
)
def test_AC_RMP_04A_rejects_unsupported_room_occupancy(room_type, occupants):
    errors = validate_profile_payload(
        _valid_profile(roomType=room_type, occupants=occupants)
    )

    assert errors["occupants"] == "จำนวนผู้พักไม่สอดคล้องกับรูปแบบห้อง"


def test_AC_RMP_02A_rejects_mixed_no_behavior_selection():
    errors = validate_profile_payload(
        _valid_profile(sleepBehaviors=["ไม่มีพฤติกรรมดังกล่าว", "กรน"])
    )

    assert "sleepBehaviors" in errors
