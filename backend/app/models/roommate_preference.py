from __future__ import annotations

from dataclasses import dataclass


# รองรับ FR-RPS-06, FR-RPS-07, FR-RPS-08, CON-RPS-05
@dataclass(frozen=True)
class RoommatePreference:
    owner_id: str
    room_occupants: int
    room_type: str
    sleep_behavior: str | None = None
    cleanliness: str | None = None
    sleep_time: str | None = None
    additional_text: str | None = None

    def to_dict(self) -> dict[str, object]:
        return {
            "owner_id": self.owner_id,
            "room_occupants": self.room_occupants,
            "room_type": self.room_type,
            "sleep_behavior": self.sleep_behavior,
            "cleanliness": self.cleanliness,
            "sleep_time": self.sleep_time,
            "additional_text": self.additional_text,
        }
