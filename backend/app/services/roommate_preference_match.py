from __future__ import annotations

from typing import Any

_saved_preferences: dict[str, dict[str, object]] = {}


def set_saved_roommate_preference(owner_id: str, preference: Any) -> None:
    # Supports FR-RPS-08 and AC-RPS-05 by publishing only preferences whose save succeeded.
    if hasattr(preference, "to_dict"):
        _saved_preferences[str(owner_id)] = preference.to_dict()
    elif isinstance(preference, dict):
        _saved_preferences[str(owner_id)] = dict(preference)


def get_saved_roommate_preference(owner_id: str) -> dict[str, object] | None:
    # Supports FR-RPS-08 and AC-RPS-05 by exposing the latest saved preference to search.
    return _saved_preferences.get(str(owner_id))


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
    saved_preference = get_saved_roommate_preference(getattr(profile, "user_id", ""))
    if saved_preference is not None:
        return saved_preference.get(attribute_name)
    return getattr(profile, attribute_name, None)


def matches_roommate_preference(profile: Any, field_name: str, field_value: Any) -> bool:
    # Supports CON-SRS-08 by comparing the shared roommate-preference values for the profile owner.
    actual_value = get_preference_value(profile, field_name)
    if actual_value is None or field_value is None:
        return False
    return str(actual_value) == str(field_value)
