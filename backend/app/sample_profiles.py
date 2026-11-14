from __future__ import annotations

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
