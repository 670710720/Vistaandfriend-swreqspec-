from __future__ import annotations

from .config import ROOMMATE_PREFERENCE_CONFIG
from .models.roommate_preference import RoommatePreference


# รองรับ CON-RPS-03, CON-RPS-06, FR-RPS-09 และ AC-RPS-02A
def validate_room_capacity(room_type: str, room_occupants: int) -> bool:
    room_config = ROOMMATE_PREFERENCE_CONFIG["roomOccupants"].get(room_type)
    if room_config is None:
        return False
    return room_config["min"] <= room_occupants <= room_config["max"]


# รองรับ FR-RPS-03, FR-RPS-09 และ AC-RPS-02C
def validate_additional_text(additional_text: str | None) -> bool:
    if additional_text is None:
        return True
    if additional_text == "":
        return True
    if additional_text.strip() == "":
        return False
    max_length = ROOMMATE_PREFERENCE_CONFIG["additionalText"]["maxLength"]
    return len(additional_text) <= max_length


# รองรับ FR-RPS-04, FR-RPS-05, CON-RPS-03, CON-RPS-04, NFR-RPS-02 และ AC-RPS-03
def validate_required_preference_fields(payload: dict[str, object]) -> list[str]:
    missing_fields: list[str] = []
    room_type = payload.get("room_type")
    room_occupants = payload.get("room_occupants")
    if room_type is None or str(room_type).strip() == "":
        missing_fields.append("room_type")
    if room_occupants is None or str(room_occupants).strip() == "":
        missing_fields.append("room_occupants")
    return missing_fields


# รองรับ FR-RPS-06, FR-RPS-07, FR-RPS-08, CON-RPS-05
class RoommatePreferenceStore:
    def __init__(self) -> None:
        self._preferences: dict[str, RoommatePreference] = {}

    def get_for_owner(self, owner_id: str) -> RoommatePreference | None:
        return self._preferences.get(owner_id)

    def save_for_owner(self, preference: RoommatePreference) -> RoommatePreference:
        if preference.owner_id == "":
            raise ValueError("owner_id is required")
        self._preferences[preference.owner_id] = preference
        return preference

    def update_for_owner(
        self,
        owner_id: str,
        preference: RoommatePreference,
    ) -> RoommatePreference:
        if preference.owner_id != owner_id:
            raise PermissionError("เฉพาะเจ้าของโปรไฟล์สามารถแก้ไขความต้องการของตนเองได้")
        if owner_id not in self._preferences:
            raise KeyError("ยังไม่มีข้อมูลความต้องการที่บันทึกไว้")
        self._preferences[owner_id] = preference
        return preference


# รองรับ FR-RPS-03 และ AC-RPS-02: รับข้อมูลความต้องการทั้งชุด
def receive_preference_for_owner(
    owner_id: str,
    payload: dict[str, object],
    store: RoommatePreferenceStore,
) -> RoommatePreference:
    missing_fields = validate_required_preference_fields(payload)
    if missing_fields:
        raise ValueError("กรุณากรอกข้อมูลที่จำเป็น: " + ", ".join(missing_fields))

    room_type = str(payload["room_type"])
    room_occupants = int(payload["room_occupants"])
    # รองรับ CON-RPS-06, FR-RPS-09 และ AC-RPS-02B
    if not validate_room_capacity(room_type, room_occupants):
        raise ValueError("จำนวนคนในห้องไม่สอดคล้องกับรูปแบบห้อง")

    additional_text = payload.get("additional_text")
    if additional_text == "":
        additional_text = None
    if additional_text is not None and not isinstance(additional_text, str):
        raise ValueError("ข้อมูลเพิ่มเติมต้องเป็นข้อความ")
    if not validate_additional_text(additional_text if isinstance(additional_text, str) else None):
        raise ValueError("ข้อมูลเพิ่มเติมต้องไม่เกิน 500 ตัวอักษรและห้ามเป็นช่องว่าง")

    preference = RoommatePreference(
        owner_id=owner_id,
        room_occupants=room_occupants,
        room_type=room_type,
        sleep_behavior=payload.get("sleep_behavior"),
        cleanliness=payload.get("cleanliness"),
        sleep_time=payload.get("sleep_time"),
        additional_text=additional_text,
    )
    return store.save_for_owner(preference)


# รองรับ FR-RPS-04, FR-RPS-06, CON-RPS-03, CON-RPS-04 และ AC-RPS-04
def save_validated_preference_for_owner(
    owner_id: str,
    payload: dict[str, object],
    store: RoommatePreferenceStore,
) -> RoommatePreference:
    return receive_preference_for_owner(owner_id, payload, store)
