from __future__ import annotations

from typing import Any


def get_preference_value(profile: Any, field_name: str) -> Any:
    # Supports CON-SRS-08 and AC-SRS-03D by reading the profile owner’s roommate-preference data.
    preference_fields = {
        "sleep_behavior": "sleep_behavior",
        "cleanliness": "cleanliness",
        "sleep_time": "sleep_time",
    }
    attribute_name = preference_fields.get(field_name)
    if attribute_name is None:
        return None
    return getattr(profile, attribute_name, None)


def matches_roommate_preference(profile: Any, field_name: str, field_value: Any) -> bool:
    # Supports CON-SRS-08 by comparing the shared roommate-preference values for the profile owner.
    actual_value = get_preference_value(profile, field_name)
    if actual_value is None or field_value is None:
        return False
    return str(actual_value) == str(field_value)
