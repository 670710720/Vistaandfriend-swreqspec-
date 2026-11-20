from __future__ import annotations

import json
from pathlib import Path

from .models.roommate_preference import RoommatePreference
from .profile_model import RoommateProfile

# รองรับ CON-ERP-01, CON-ERP-02, FR-ERP-02, ASM-ERP-03, ASM-ERP-05
OWNER_PROFILE = RoommateProfile(
    profile_id="profile-erp-001",
    user_id="student-1001",
    name="นักศึกษา A",
    gender="หญิง",
    age=22,
    faculty="วิศวกรรมศาสตร์",
    academic_year="ชั้นปีที่ 3",
    profile_image="profile-erp-001.jpg",
    phone="0812345678",
    room_type="ห้องแอร์",
    room_occupants=2,
    sleep_behaviors=["กรน", "นอนดิ้น"],
    other_sleep_behavior="",
    is_searchable=True,
    is_active=True,
)

OTHER_PROFILE = RoommateProfile(
    profile_id="profile-erp-002",
    user_id="student-1002",
    name="นักศึกษา B",
    gender="ชาย",
    age=21,
    faculty="คณะวิทยาศาสตร์",
    academic_year="ชั้นปีที่ 2",
    profile_image="profile-erp-002.jpg",
    phone="0923456789",
    room_type="ห้องพัดลม",
    room_occupants=3,
    sleep_behaviors=["ไม่มีพฤติกรรมดังกล่าว"],
    other_sleep_behavior="",
    is_searchable=False,
    is_active=True,
)

SAMPLE_PROFILES = {
    "owner": OWNER_PROFILE,
    "other": OTHER_PROFILE,
}


def get_sample_owner_profile() -> RoommateProfile:
    return OWNER_PROFILE


def get_sample_profile_set() -> dict[str, RoommateProfile]:
    return SAMPLE_PROFILES.copy()


# รองรับ CON-RPS-01, CON-RPS-02: ข้อมูลตัวอย่างสำหรับผู้ที่มีและไม่มีโปรไฟล์
_PREFERENCE_DATA_PATH = Path(__file__).parent / "data" / "sample_roommate_preferences.json"


def get_sample_preference_data() -> list[dict[str, object]]:
    with _PREFERENCE_DATA_PATH.open("r", encoding="utf-8") as preference_file:
        return json.load(preference_file)


def get_sample_owner_preference() -> RoommatePreference | None:
    for item in get_sample_preference_data():
        if item.get("owner_id") == "student-1001" and item.get("has_profile"):
            data = item["preference"]
            if not isinstance(data, dict):
                return None
            return RoommatePreference(
                owner_id=str(data["owner_id"]),
                room_occupants=int(data["room_occupants"]),
                room_type=str(data["room_type"]),
                sleep_behavior=data.get("sleep_behavior"),
                cleanliness=data.get("cleanliness"),
                sleep_time=data.get("sleep_time"),
                additional_text=data.get("additional_text"),
            )
    return None


def get_sample_missing_profile_user_id() -> str:
    for item in get_sample_preference_data():
        if item.get("has_profile") is False:
            return str(item["owner_id"])
    return "student-404"
