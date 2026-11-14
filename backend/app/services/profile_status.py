from __future__ import annotations

from app.services.search_roommate import SearchRoommateService


def has_roommate_profile(user_id: str) -> bool:
    """Support CON-SRS-02 and AC-SRS-07 by checking whether a user already has a roommate profile."""
    if not user_id or not str(user_id).strip():
        return False
    return any(profile.user_id == str(user_id).strip() for profile in SearchRoommateService().profiles)
