from __future__ import annotations

from typing import Any


def matches_filter(profile: Any, field_name: str, field_value: Any) -> bool:
    # Supports FR-SRS-03, FR-SRS-04, and FR-SRS-05 for multi-filter matching.
    if field_name == "age":
        return getattr(profile, "age", None) == int(field_value)
    if field_name == "gender":
        return getattr(profile, "gender", None) == str(field_value)
    if field_name == "faculty":
        return getattr(profile, "faculty", None) == str(field_value)
    if field_name == "academic_year":
        return getattr(profile, "academic_year", None) == str(field_value)
    if field_name == "room_type":
        return getattr(profile, "room_type", None) == str(field_value)
    if field_name == "room_size":
        return getattr(profile, "room_size", None) == int(field_value)
    if field_name == "sleep_behavior":
        return getattr(profile, "sleep_behavior", None) == str(field_value)
    if field_name == "cleanliness":
        return getattr(profile, "cleanliness", None) == str(field_value)
    if field_name == "sleep_time":
        return getattr(profile, "sleep_time", None) == str(field_value)
    return False


def filter_profiles_by_mode(profiles: list[Any], filters: dict[str, Any], mode: str = "AND") -> list[Any]:
    # Supports FR-SRS-03, FR-SRS-04, and FR-SRS-05 for AND/OR logic and ordering by match count.
    if not filters:
        return list(profiles)

    normalized_mode = str(mode).upper()
    ranked_profiles: list[tuple[Any, int]] = []
    for profile in profiles:
        match_count = 0
        matches: list[bool] = []
        for field_name, field_value in filters.items():
            matched = matches_filter(profile, field_name, field_value)
            matches.append(matched)
            if matched:
                match_count += 1

        if normalized_mode == "OR":
            include = any(matches)
        else:
            include = all(matches)

        if include:
            ranked_profiles.append((profile, match_count))

    ranked_profiles.sort(key=lambda item: -item[1])
    return [profile for profile, _ in ranked_profiles]
