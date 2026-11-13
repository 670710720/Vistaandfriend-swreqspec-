from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Literal

from .profile_model import RoommateProfile
from .profile_update import ProfileUpdateResult, apply_profile_update
from .profile_validation import PROFILE_EDITABLE_FIELDS, PROFILE_LOCKED_FIELDS, validate_profile_save
from .search_visibility_service import get_visible_profiles, is_profile_search_visible

# รองรับ CON-ERP-01, CON-ERP-02, FR-ERP-01, FR-ERP-02, NFR-ERP-01, AC-ERP-01, AC-ERP-05, AC-ERP-06
@dataclass(frozen=True)
class ProfileAccessResult:
    profile: RoommateProfile | None
    status: Literal["ok", "missing_profile", "forbidden"]
    redirect_to_create: bool = False
    message: str = ""


# รองรับ CON-ERP-01, CON-ERP-02, FR-ERP-01, FR-ERP-02, NFR-ERP-01, AC-ERP-01, AC-ERP-05, AC-ERP-06
def load_profile_for_user(
    current_user_id: str,
    target_user_id: str,
    profiles: dict[str, RoommateProfile],
) -> ProfileAccessResult:
    """โหลดข้อมูลโปรไฟล์ของผู้ใช้ปัจจุบันและตรวจสิทธิ์ก่อนเปิดดู/แก้ไข"""
    if target_user_id != current_user_id:
        return ProfileAccessResult(
            profile=None,
            status="forbidden",
            redirect_to_create=False,
            message="ไม่อนุญาตให้ดูหรือแก้ไขโปรไฟล์ของผู้อื่น",
        )

    profile = profiles.get(target_user_id)
    if profile is None:
        profile = next(
            (item for item in profiles.values() if item.user_id == target_user_id),
            None,
        )

    if profile is None:
        return ProfileAccessResult(
            profile=None,
            status="missing_profile",
            redirect_to_create=True,
            message="ยังไม่มีโปรไฟล์ กรุณาสร้างโปรไฟล์หาเมทก่อน",
        )

    return ProfileAccessResult(
        profile=profile,
        status="ok",
        redirect_to_create=False,
        message="โหลดข้อมูลโปรไฟล์สำเร็จ",
    )


# รองรับ CON-ERP-06, CON-ERP-07, FR-ERP-03, FR-ERP-04, FR-ERP-09, NFR-ERP-01, AC-ERP-02, AC-ERP-02A, AC-ERP-02B, AC-ERP-05
def update_profile_for_user(
    current_user_id: str,
    target_user_id: str,
    profiles: dict[str, RoommateProfile],
    updates: dict[str, object],
) -> ProfileUpdateResult:
    """อัปเดตข้อมูลโปรไฟล์ที่จ่ายเฉพาะฟิลด์อนุญาตสำหรับเจ้าของเท่านั้น"""
    return apply_profile_update(current_user_id, target_user_id, profiles, updates)


# รองรับ CON-ERP-03, CON-ERP-04, CON-ERP-05, FR-ERP-05, FR-ERP-06, NFR-ERP-02, AC-ERP-03, AC-ERP-04A
@dataclass(frozen=True)
class SaveProfileResult:
    profile: RoommateProfile | None
    status: Literal["updated", "rejected", "forbidden", "missing_profile", "save_failed"]
    message: str
    errors: dict[str, str] | None = None


_FIELD_ALIASES = {
    "academicYear": "academic_year",
    "profileImage": "profile_image",
    "roomType": "room_type",
    "occupants": "room_occupants",
    "sleepBehaviors": "sleep_behaviors",
    "otherSleepBehavior": "other_sleep_behavior",
    "isSearchable": "is_searchable",
}


def save_profile_update(
    current_user_id: str,
    target_user_id: str,
    profiles: dict[str, RoommateProfile],
    updates: dict[str, object],
    save_callback=None,
) -> SaveProfileResult:
    """ยืนยันว่า payload ถูกต้องก่อนบันทึก และคงข้อมูลเดิมไว้หากบันทึกล้มเหลว"""
    if target_user_id != current_user_id:
        return SaveProfileResult(
            profile=None,
            status="forbidden",
            message="ไม่อนุญาตให้แก้ไขโปรไฟล์ของผู้อื่น",
            errors={},
        )

    profile = next((item for item in profiles.values() if item.user_id == target_user_id), None)
    if profile is None:
        return SaveProfileResult(
            profile=None,
            status="missing_profile",
            message="ยังไม่มีโปรไฟล์ กรุณาสร้างโปรไฟล์ก่อนแก้ไข",
            errors={},
        )

    locked_errors: dict[str, str] = {}
    for field_name in PROFILE_LOCKED_FIELDS:
        if field_name in updates and updates.get(field_name) not in (None, ""):
            locked_errors[field_name] = "ชื่อไม่อนุญาตให้แก้ไข" if field_name == "name" else "เพศไม่อนุญาตให้แก้ไข"

    if locked_errors:
        return SaveProfileResult(
            profile=None,
            status="rejected",
            message="ไม่อนุญาตให้แก้ไขฟิลด์ที่ล็อก",
            errors=locked_errors,
        )

    allowed_updates = {key: value for key, value in updates.items() if key in PROFILE_EDITABLE_FIELDS}
    if not allowed_updates:
        return SaveProfileResult(
            profile=None,
            status="rejected",
            message="ไม่มีฟิลด์ที่อนุญาตให้เปลี่ยนแปลง",
            errors={},
        )

    current_values = {
        "name": profile.name,
        "gender": profile.gender,
        "age": profile.age,
        "faculty": profile.faculty,
        "academicYear": profile.academic_year,
        "profileImage": profile.profile_image,
        "phone": profile.phone,
        "roomType": profile.room_type,
        "occupants": profile.room_occupants,
        "sleepBehaviors": profile.sleep_behaviors,
        "otherSleepBehavior": profile.other_sleep_behavior,
        "isSearchable": profile.is_searchable,
    }
    validation_errors = validate_profile_save(current_values, allowed_updates)
    if validation_errors:
        return SaveProfileResult(
            profile=None,
            status="rejected",
            message="ข้อมูลไม่ครบหรือไม่ถูกต้อง",
            errors=validation_errors,
        )

    updated_profile = replace(profile, **{_FIELD_ALIASES.get(key, key): value for key, value in allowed_updates.items()})
    try:
        if save_callback is not None:
            save_callback(updated_profile)
        else:
            profiles[target_user_id] = updated_profile
    except Exception:
        return SaveProfileResult(
            profile=None,
            status="save_failed",
            message="การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่",
            errors={"save": "การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่"},
        )

    if save_callback is None:
        profiles[target_user_id] = updated_profile

    visible_profiles = get_visible_profiles(profiles)
    if is_profile_search_visible(updated_profile):
        visible_profiles = [item for item in visible_profiles if item.user_id == target_user_id or item.user_id != target_user_id]

    return SaveProfileResult(
        profile=updated_profile,
        status="updated",
        message="อัปเดตโปรไฟล์สำเร็จ",
        errors={},
    )
