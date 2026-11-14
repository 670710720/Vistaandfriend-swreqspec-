from __future__ import annotations

from dataclasses import dataclass, field, replace
from typing import Literal

from .profile_model import RoommateProfile
from .profile_validation import PROFILE_EDITABLE_FIELDS, PROFILE_LOCKED_FIELDS

# รองรับ CON-ERP-06, CON-ERP-07, FR-ERP-03, FR-ERP-04, FR-ERP-09, NFR-ERP-01, AC-ERP-02, AC-ERP-02A, AC-ERP-02B, AC-ERP-05
@dataclass(frozen=True)
class ProfileUpdateResult:
    profile: RoommateProfile | None
    status: Literal["updated", "rejected", "forbidden", "missing_profile"]
    message: str
    errors: dict[str, str] = field(default_factory=dict)


_FIELD_ALIASES = {
    "academicYear": "academic_year",
    "profileImage": "profile_image",
    "roomType": "room_type",
    "occupants": "room_occupants",
    "sleepBehaviors": "sleep_behaviors",
    "otherSleepBehavior": "other_sleep_behavior",
    "isSearchable": "is_searchable",
}


def _resolve_profile_by_user_id(profiles: dict[str, RoommateProfile], user_id: str) -> RoommateProfile | None:
    profile = profiles.get(user_id)
    if profile is not None:
        return profile
    return next((item for item in profiles.values() if item.user_id == user_id), None)


# รองรับ CON-ERP-06, CON-ERP-07, FR-ERP-03, FR-ERP-04, FR-ERP-09, NFR-ERP-01, AC-ERP-02, AC-ERP-02A, AC-ERP-02B, AC-ERP-05
def apply_profile_update(
    current_user_id: str,
    target_user_id: str,
    profiles: dict[str, RoommateProfile],
    updates: dict[str, object],
) -> ProfileUpdateResult:
    """ยืนยันว่ามีสิทธิ์แก้ไขโปรไฟล์และบันทึกเฉพาะฟิลด์ที่อนุญาตเท่านั้น"""
    if target_user_id != current_user_id:
        return ProfileUpdateResult(
            profile=None,
            status="forbidden",
            message="ไม่อนุญาตให้แก้ไขโปรไฟล์ของผู้อื่น",
        )

    profile = _resolve_profile_by_user_id(profiles, target_user_id)
    if profile is None:
        return ProfileUpdateResult(
            profile=None,
            status="missing_profile",
            message="ยังไม่มีโปรไฟล์ กรุณาสร้างโปรไฟล์ก่อนแก้ไข",
        )

    locked_errors: dict[str, str] = {}
    for field_name in PROFILE_LOCKED_FIELDS:
        if field_name in updates and updates.get(field_name) not in (None, ""):
            locked_errors[field_name] = "ชื่อไม่อนุญาตให้แก้ไข" if field_name == "name" else "เพศไม่อนุญาตให้แก้ไข"

    allowed_updates = {
        key: value
        for key, value in updates.items()
        if key in PROFILE_EDITABLE_FIELDS
    }

    if locked_errors:
        return ProfileUpdateResult(
            profile=None,
            status="rejected",
            message="ไม่อนุญาตให้แก้ไขฟิลด์ที่ล็อก",
            errors=locked_errors,
        )

    if not allowed_updates:
        return ProfileUpdateResult(
            profile=profile,
            status="rejected",
            message="ไม่มีฟิลด์ที่อนุญาตให้เปลี่ยนแปลง",
            errors={},
        )

    updated_profile = replace(profile, **{_FIELD_ALIASES.get(key, key): value for key, value in allowed_updates.items()})
    profiles[target_user_id] = updated_profile
    return ProfileUpdateResult(
        profile=updated_profile,
        status="updated",
        message="อัปเดตโปรไฟล์สำเร็จ",
    )
