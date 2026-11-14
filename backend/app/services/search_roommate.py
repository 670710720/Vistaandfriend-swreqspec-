from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal

from app.config import SEARCH_RESULTS_PER_PAGE
from app.services.filter_logic import filter_profiles_by_mode
from app.services.roommate_preference_match import matches_roommate_preference


class SearchRoommateQueryResult(list["SearchRoommateProfile"]):
    """Support FR-SRS-07 and CON-SRS-05 by preserving an explicit empty-result status and message."""

    def __init__(self, items: list["SearchRoommateProfile"] | None = None, status: str = "ok", message: str = ""):
        super().__init__(items or [])
        self.status = status
        self.message = message


@dataclass(frozen=True)
class SearchRoommateProfile:
    """Profile data used by the roommate search feature."""

    user_id: str
    name: str
    age: int
    gender: str
    faculty: str
    academic_year: str
    room_type: str
    room_size: int
    is_open_for_search: bool = True
    sleep_behavior: str | None = None
    cleanliness: str | None = None
    sleep_time: str | None = None
    social_links: dict[str, str] = field(default_factory=dict)
    phone_number: str | None = None


class SearchRoommateService:
    """Support FR-SRS-04, FR-SRS-05, CON-SRS-03, CON-SRS-04."""

    def __init__(self, profiles: list[SearchRoommateProfile] | None = None):
        self.profiles = profiles or self._build_seed_profiles()

    @staticmethod
    def _build_seed_profiles() -> list[SearchRoommateProfile]:
        return [
            SearchRoommateProfile(
                user_id="user-1",
                name="ผู้ใช้หลัก",
                age=22,
                gender="หญิง",
                faculty="วิศวกรรมศาสตร์",
                academic_year="2",
                room_type="ห้องแยก",
                room_size=2,
                is_open_for_search=True,
                sleep_behavior="กรน",
                cleanliness="สะอาด",
                sleep_time="23:00",
                social_links={"Facebook": "fb-user-1", "LINE": "line-user-1"},
                phone_number="0912345678",
            ),
            SearchRoommateProfile(
                user_id="user-2",
                name="น้องแอปเปิล",
                age=21,
                gender="หญิง",
                faculty="วิศวกรรมศาสตร์",
                academic_year="2",
                room_type="ห้องแยก",
                room_size=2,
                is_open_for_search=True,
                sleep_behavior="กรน",
                cleanliness="สะอาด",
                sleep_time="22:30",
                social_links={"Facebook": "fb-user-2", "Instagram": "ig-user-2"},
                phone_number="0998765432",
            ),
            SearchRoommateProfile(
                user_id="user-3",
                name="ปอปอ",
                age=23,
                gender="ชาย",
                faculty="แพทยศาสตร์",
                academic_year="3",
                room_type="ห้องรวม",
                room_size=4,
                is_open_for_search=False,
                sleep_behavior="กัดฟัน",
                cleanliness="ไม่สะอาด",
                sleep_time="00:15",
                social_links={"TikTok": "tt-user-3"},
                phone_number="0812345678",
            ),
            SearchRoommateProfile(
                user_id="user-4",
                name="เบลล่า",
                age=20,
                gender="หญิง",
                faculty="วิทยาศาสตร์",
                academic_year="1",
                room_type="ห้องแยก",
                room_size=1,
                is_open_for_search=True,
                sleep_behavior="นอนดิ้น",
                cleanliness="สะอาด",
                sleep_time="23:30",
                social_links={"LINE": "line-user-4"},
                phone_number="0834567890",
            ),
        ]

    def query_roommates(
        self,
        current_user_id: str,
        filters: dict[str, Any] | None = None,
        mode: Literal["AND", "OR"] = "AND",
        page: int = 1,
    ) -> SearchRoommateQueryResult:
        # Supports FR-SRS-04, FR-SRS-05, FR-SRS-07, FR-SRS-08, FR-SRS-09, CON-SRS-04, CON-SRS-05, CON-SRS-06, and CON-SRS-07.
        normalized_filters = self._normalize_filters(filters)
        base_results = self._searchable_profiles(current_user_id)

        if not normalized_filters:
            results = base_results
        else:
            mode = mode.upper()
            results = filter_profiles_by_mode(base_results, normalized_filters, mode)

        paginated_results = self.pagination(results, page)
        if not paginated_results:
            return SearchRoommateQueryResult([], status="empty", message="ไม่พบผลการค้นหา")
        return SearchRoommateQueryResult(paginated_results, status="ok", message="")

    def _searchable_profiles(self, current_user_id: str) -> list[SearchRoommateProfile]:
        # Supports CON-SRS-04, CON-SRS-06, and CON-SRS-07 by excluding closed and self profiles.
        return [
            profile
            for profile in self.profiles
            if profile.user_id != current_user_id and profile.is_open_for_search
        ]

    def _normalize_filters(self, filters: dict[str, Any] | None) -> dict[str, Any]:
        if not filters:
            return {}
        normalized: dict[str, Any] = {}
        for key, value in filters.items():
            if value is None:
                continue
            if isinstance(value, str) and not value.strip():
                continue
            if isinstance(value, (list, tuple, set)) and not value:
                continue
            normalized[key] = value
        return normalized

    def _matches_filter(self, profile: SearchRoommateProfile, field_name: str, field_value: Any) -> bool:
        # Supports FR-SRS-03, FR-SRS-04, and CON-SRS-08 for profile criteria and roommate-preference criteria.
        if field_name in {"sleep_behavior", "cleanliness", "sleep_time"}:
            return matches_roommate_preference(profile, field_name, field_value)
        if field_name == "age":
            return profile.age == int(field_value)
        if field_name == "gender":
            return profile.gender == str(field_value)
        if field_name == "faculty":
            return profile.faculty == str(field_value)
        if field_name == "academic_year":
            return profile.academic_year == str(field_value)
        if field_name == "room_type":
            return profile.room_type == str(field_value)
        if field_name == "room_size":
            return profile.room_size == int(field_value)
        return False

    def pagination(self, results: list[SearchRoommateProfile], page: int = 1) -> list[SearchRoommateProfile]:
        # Supports FR-SRS-08 and FR-SRS-09 by forcing every search to start from page 1 and limiting each page to 20 results.
        page = max(1, int(page))
        start = (page - 1) * SEARCH_RESULTS_PER_PAGE
        end = start + SEARCH_RESULTS_PER_PAGE
        return results[start:end]
