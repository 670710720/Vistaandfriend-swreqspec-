from __future__ import annotations

from collections.abc import Callable, Generator

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from .config import ROOMMATE_PREFERENCE_CONFIG
from .middleware.auth_guard import get_authenticated_user_id
from .models.roommate_profile import RoommateProfile
from .models.roommate_preference import RoommatePreference
from .services.roommate_preference_match import set_saved_roommate_preference

router = APIRouter()


def get_roommate_preference_db(request: Request) -> Generator[Session, None, None]:
    """Provide the configured profile database session for CON-RPS-02."""
    session = request.app.state.session_factory()
    try:
        yield session
    finally:
        session.close()


# รองรับ FR-RPS-01, FR-RPS-02, CON-RPS-01, CON-RPS-02, AC-RPS-01 และ AC-RPS-07
@router.get("/api/roommate-preferences")
def get_roommate_preference_options(
    owner_id: str = Depends(get_authenticated_user_id),
    db: Session = Depends(get_roommate_preference_db),
) -> dict[str, object]:
    if db.get(RoommateProfile, owner_id) is None:
        return {"status": "missing_profile"}
    return {"options": ROOMMATE_PREFERENCE_CONFIG}


# รองรับ CON-RPS-01, CON-RPS-05, NFR-RPS-01 และ AC-RPS-06
@router.get("/api/roommate-preferences/{owner_id}")
def get_roommate_preference_for_owner(
    owner_id: str,
    request: Request,
    authenticated_owner_id: str = Depends(get_authenticated_user_id),
) -> dict[str, object]:
    if owner_id != authenticated_owner_id:
        raise HTTPException(
            status_code=403,
            detail="เฉพาะเจ้าของโปรไฟล์สามารถเข้าถึงความต้องการของตนเองได้",
        )

    store = _get_roommate_preference_store(request)
    preference = store.get_for_owner(owner_id)
    if preference is None:
        raise HTTPException(status_code=404, detail="ยังไม่มีข้อมูลความต้องการที่บันทึกไว้")
    return {"preference": preference.to_dict()}


# รองรับ FR-RPS-04, FR-RPS-06, FR-RPS-09 และ AC-RPS-04B
@router.post("/api/roommate-preferences")
def save_roommate_preference(
    payload: dict[str, object],
    request: Request,
    owner_id: str = Depends(get_authenticated_user_id),
) -> dict[str, object]:
    claimed_owner_id = payload.get("owner_id")
    if claimed_owner_id is not None and str(claimed_owner_id) != owner_id:
        raise HTTPException(
            status_code=403,
            detail="เฉพาะเจ้าของโปรไฟล์สามารถบันทึกความต้องการของตนเองได้",
        )

    store = _get_roommate_preference_store(request)
    persist = getattr(request.app.state, "roommate_preference_persist", None)
    try:
        missing_fields = validate_required_preference_fields(payload)
        if missing_fields:
            raise ValueError("กรุณากรอกข้อมูลที่จำเป็น: " + ", ".join(missing_fields))
        room_type = str(payload["room_type"])
        room_occupants = int(payload["room_occupants"])
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
        saved = store.save_for_owner_atomically(preference, persist)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail="ไม่สามารถบันทึกความต้องการได้ กรุณาลองใหม่",
        ) from error
    set_saved_roommate_preference(owner_id, saved)
    return {"preference": saved.to_dict()}


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

    # รองรับ FR-RPS-06, FR-RPS-09 และ AC-RPS-04B
    def save_for_owner_atomically(
        self,
        preference: RoommatePreference,
        persist: Callable[[RoommatePreference], object] | None = None,
    ) -> RoommatePreference:
        if preference.owner_id == "":
            raise ValueError("owner_id is required")
        if persist is not None:
            persist(preference)
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

    # รองรับ FR-RPS-06, FR-RPS-09 และ AC-RPS-04B
    def update_for_owner_atomically(
        self,
        owner_id: str,
        preference: RoommatePreference,
        persist: Callable[[RoommatePreference], object] | None = None,
    ) -> RoommatePreference:
        if preference.owner_id != owner_id:
            raise PermissionError("เฉพาะเจ้าของโปรไฟล์สามารถแก้ไขความต้องการของตนเองได้")
        if owner_id not in self._preferences:
            raise KeyError("ยังไม่มีข้อมูลความต้องการที่บันทึกไว้")

        if persist is not None:
            persist(preference)
        self._preferences[owner_id] = preference
        return preference


def _get_roommate_preference_store(request: Request) -> RoommatePreferenceStore:
    store = getattr(request.app.state, "roommate_preference_store", None)
    if not isinstance(store, RoommatePreferenceStore):
        store = RoommatePreferenceStore()
        request.app.state.roommate_preference_store = store
    return store


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


# รองรับ FR-RPS-06, CON-RPS-05, NFR-RPS-01 และ AC-RPS-04A
@router.put("/api/roommate-preferences/{owner_id}")
def update_roommate_preference(
    owner_id: str,
    payload: dict[str, object],
    request: Request,
    authenticated_owner_id: str = Depends(get_authenticated_user_id),
) -> dict[str, object]:
    if owner_id != authenticated_owner_id:
        raise HTTPException(
            status_code=403,
            detail="เฉพาะเจ้าของโปรไฟล์สามารถแก้ไขความต้องการของตนเองได้",
        )

    store = _get_roommate_preference_store(request)
    persist = getattr(request.app.state, "roommate_preference_persist", None)
    try:
        validated = receive_preference_for_owner(owner_id, payload, RoommatePreferenceStore())
        updated = store.update_for_owner_atomically(owner_id, validated, persist)
    except KeyError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except PermissionError as error:
        raise HTTPException(status_code=403, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail="ไม่สามารถบันทึกความต้องการได้ กรุณาลองใหม่",
        ) from error
    set_saved_roommate_preference(owner_id, updated)
    return {"preference": updated.to_dict()}
