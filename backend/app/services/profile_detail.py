from __future__ import annotations

from typing import Any

from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService


class ProfileDetailService:
    """Support FR-SRS-06 and CON-SRS-06 by exposing allowed profile details only."""

    def __init__(self, profiles: list[SearchRoommateProfile] | None = None):
        self.service = SearchRoommateService(profiles=profiles)

    def get_profile_detail(self, current_user_id: str, profile_user_id: str) -> dict[str, Any]:
        """Return the requested profile with social links only and without contact phone numbers."""
        searchable = self.service._searchable_profiles(current_user_id)
        profile = next((item for item in searchable if item.user_id == profile_user_id), None)
        if profile is None:
            raise ValueError(f"Profile {profile_user_id} is not available for viewing.")

        return {
            "user_id": profile.user_id,
            "name": profile.name,
            "age": profile.age,
            "gender": profile.gender,
            "faculty": profile.faculty,
            "academic_year": profile.academic_year,
            "room_type": profile.room_type,
            "room_size": profile.room_size,
            "is_open_for_search": profile.is_open_for_search,
            "sleep_behavior": profile.sleep_behavior,
            "cleanliness": profile.cleanliness,
            "sleep_time": profile.sleep_time,
            "social_links": profile.social_links,
            "phone_number": None,
        }
