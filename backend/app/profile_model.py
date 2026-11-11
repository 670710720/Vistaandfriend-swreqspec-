from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

# รองรับ FR-ERP-02, FR-ERP-03, FR-ERP-04, CON-ERP-03, CON-ERP-06, CON-ERP-07
@dataclass(frozen=True)
class RoommateProfile:
    profile_id: str
    user_id: str
    name: str
    gender: Literal["ชาย", "หญิง", "อื่นๆ"]
    age: int
    faculty: str
    academic_year: str
    profile_image: str | None = None
    phone: str = ""
    room_type: str = ""
    room_occupants: int = 0
    sleep_behaviors: list[str] = field(default_factory=list)
    other_sleep_behavior: str = ""
    is_searchable: bool = False
    is_active: bool = True

    @property
    def editable_fields(self) -> list[str]:
        return [
            "age",
            "faculty",
            "academic_year",
            "profile_image",
            "phone",
            "room_type",
            "room_occupants",
            "sleep_behaviors",
            "other_sleep_behavior",
            "is_searchable",
        ]

    @property
    def locked_fields(self) -> list[str]:
        return ["name", "gender"]

    def can_edit(self, field_name: str) -> bool:
        return field_name not in self.locked_fields and field_name in self.editable_fields
