from __future__ import annotations

from dataclasses import replace

from .profile_model import RoommateProfile

# รองรับ FR-ERP-05, FR-ERP-07, FR-ERP-08, FR-ERP-09, NFR-ERP-04, AC-ERP-04, AC-ERP-07, AC-ERP-07A

def is_profile_search_visible(profile: RoommateProfile | None) -> bool:
    """ตรวจว่าโปรไฟล์มีสิทธิ์ปรากฏในผลการค้นหาโดยอิงสถานะเปิดให้ค้นหาและสถานะโปรไฟล์"""
    if profile is None:
        return False
    return bool(profile.is_searchable and profile.is_active)


def get_visible_profiles(profiles: dict[str, RoommateProfile]) -> list[RoommateProfile]:
    """คืนรายการโปรไฟล์ที่พร้อมแสดงในผลการค้นหา"""
    return [profile for profile in profiles.values() if is_profile_search_visible(profile)]


def set_profile_search_visibility(profile: RoommateProfile, is_searchable: bool) -> RoommateProfile:
    """อัปเดตสถานะเปิดให้ค้นหาของโปรไฟล์โดยคงข้อมูลอื่น ๆ ไว้เหมือนเดิม"""
    return replace(profile, is_searchable=bool(is_searchable))
