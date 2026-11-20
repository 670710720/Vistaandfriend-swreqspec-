import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.config import ROOMMATE_PREFERENCE_CONFIG
from app.database import Base, create_database
from app.models.roommate_profile import RoommateProfile
from app.models.roommate_preference import RoommatePreference
from app.roommate_preferences import RoommatePreferenceStore, router as roommate_preferences_router


@pytest.fixture
def roommate_preference_api(tmp_path):
    engine, session_factory = create_database(f"sqlite:///{tmp_path / 'roommate-preferences.db'}")
    Base.metadata.create_all(bind=engine)
    app = FastAPI()
    app.state.session_factory = session_factory

    @app.middleware("http")
    async def set_authenticated_user(request, call_next):
        user_id = request.headers.get("X-Test-User")
        if user_id:
            request.state.user_id = user_id
        return await call_next(request)

    app.include_router(roommate_preferences_router)
    with TestClient(app) as client:
        yield client, session_factory
    engine.dispose()


def _create_profile(session_factory, user_id):
    with session_factory() as db:
        db.add(
            RoommateProfile(
                user_id=user_id,
                nickname="นักศึกษา",
                age=20,
                gender="หญิง",
                faculty="วิศวกรรมศาสตร์",
                academic_year="ชั้นปีที่ 2",
                profile_image=b"profile",
                phone="0812345678",
                room_type="ห้องแอร์",
                room_occupants=2,
                sleep_behaviors=["กรน"],
            )
        )
        db.commit()


def test_T02_roommate_preference_storage_binds_owner_and_keeps_six_fields():
    store = RoommatePreferenceStore()
    preference = RoommatePreference(
        owner_id="student-1",
        room_occupants=2,
        room_type="airConditioned",
        sleep_behavior="กรน",
        cleanliness="สะอาดมาก",
        sleep_time="22:00–00:00",
        additional_text="ไม่ส่งเสียงตอนนอน",
    )

    saved = store.save_for_owner(preference)

    assert saved is preference
    assert store.get_for_owner("student-1") is preference
    assert preference.to_dict() == {
        "owner_id": "student-1",
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "ไม่ส่งเสียงตอนนอน",
    }


def test_T02_roommate_preference_storage_rejects_other_owner_update():
    store = RoommatePreferenceStore()
    original = RoommatePreference(
        owner_id="student-1",
        room_occupants=2,
        room_type="airConditioned",
    )
    store.save_for_owner(original)
    attempted = RoommatePreference(
        owner_id="student-2",
        room_occupants=3,
        room_type="fan",
    )

    try:
        store.update_for_owner("student-1", attempted)
    except PermissionError:
        pass
    else:
        raise AssertionError("ควรปฏิเสธการแก้ไขข้อมูลที่ไม่ใช่เจ้าของ")

    assert store.get_for_owner("student-1") is original


def test_AC_RPS_02_accepts_preference_selection_and_additional_text():
    from app.roommate_preferences import receive_preference_for_owner

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    store = RoommatePreferenceStore()
    payload = {
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "ต้องการห้องเงียบ",
    }

    # When นักศึกษาเลือกหรือกรอกข้อมูลความต้องการ
    preference = receive_preference_for_owner("student-1", payload, store)

    # Then ระบบรับข้อมูลครบทั้ง 6 หัวข้อของนักศึกษา
    assert preference.to_dict() == {
        "owner_id": "student-1",
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "ต้องการห้องเงียบ",
    }
    assert store.get_for_owner("student-1") is preference


def test_AC_RPS_02A_accepts_valid_and_boundary_room_capacity():
    from app.roommate_preferences import validate_room_capacity

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    # When นักศึกษาระบุจำนวนคนและรูปแบบห้อง
    assert validate_room_capacity("airConditioned", 2) is True
    assert validate_room_capacity("fan", 2) is True
    assert validate_room_capacity("airConditioned", 1) is True
    assert validate_room_capacity("airConditioned", 4) is True
    assert validate_room_capacity("fan", 1) is True
    assert validate_room_capacity("fan", 3) is True

    # Then ระบบยอมรับเฉพาะช่วงที่กำหนด
    assert validate_room_capacity("airConditioned", 5) is False
    assert validate_room_capacity("fan", 4) is False


def test_AC_RPS_02B_rejects_incompatible_capacity_without_saving():
    from app.roommate_preferences import receive_preference_for_owner

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    store = RoommatePreferenceStore()
    payload = {
        "room_occupants": 4,
        "room_type": "fan",
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "",
    }

    # When นักศึกษาเลือกห้องพัดลม 4 คนแล้วพยายามบันทึก
    try:
        receive_preference_for_owner("student-1", payload, store)
    except ValueError as exc:
        # Then ระบบแจ้งข้อผิดพลาดและไม่อนุญาตบันทึก
        assert str(exc) == "จำนวนคนในห้องไม่สอดคล้องกับรูปแบบห้อง"
    else:
        raise AssertionError("ควรปฏิเสธชุดข้อมูลที่ไม่สอดคล้อง")

    assert store.get_for_owner("student-1") is None


def test_AC_RPS_02C_accepts_additional_text_limit_and_rejects_invalid_text():
    from app.roommate_preferences import receive_preference_for_owner, validate_additional_text

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    assert validate_additional_text(None) is True
    assert validate_additional_text("") is True
    assert validate_additional_text("ก" * 500) is True

    # When นักศึกษากรอกเกิน 500 ตัวอักษรหรือเป็นช่องว่าง
    assert validate_additional_text("ก" * 501) is False
    assert validate_additional_text("   ") is False

    # Then การบันทึกข้อมูลไม่เสร็จและไม่มี record ถูกสร้าง
    store = RoommatePreferenceStore()
    payload = {
        "room_occupants": 2,
        "room_type": "airConditioned",
        "sleep_behavior": None,
        "cleanliness": None,
        "sleep_time": None,
        "additional_text": "ก" * 501,
    }
    try:
        receive_preference_for_owner("student-1", payload, store)
    except ValueError as exc:
        assert "ข้อมูลเพิ่มเติม" in str(exc)
    else:
        raise AssertionError("ควรปฏิเสธข้อมูลเพิ่มเติมเกิน 500 ตัวอักษร")
    assert store.get_for_owner("student-1") is None


def test_AC_RPS_03_rejects_missing_required_fields_without_saving():
    from app.roommate_preferences import receive_preference_for_owner, validate_required_preference_fields

    # Given นักศึกษาอยู่ในหน้าความต้องการหาเมท
    store = RoommatePreferenceStore()

    # When นักศึกษายืนยันโดยไม่มีจำนวนคนและรูปแบบห้อง
    empty_payload = {"room_type": "", "room_occupants": None}
    assert validate_required_preference_fields(empty_payload) == [
        "room_type",
        "room_occupants",
    ]
    try:
        receive_preference_for_owner("student-1", empty_payload, store)
    except ValueError as exc:
        assert "ข้อมูลที่จำเป็น" in str(exc)
    else:
        raise AssertionError("ควรปฏิเสธเมื่อไม่มีข้อมูลจำเป็น")

    # When เว้นข้อมูลจำเป็นไว้หนึ่งรายการ
    missing_occupants = {"room_type": "airConditioned", "room_occupants": None}
    assert validate_required_preference_fields(missing_occupants) == ["room_occupants"]

    # Then ระบบไม่บันทึกข้อมูลความต้องการ
    assert store.get_for_owner("student-1") is None


def test_AC_RPS_04_saves_valid_preference_and_boundary_limits():
    from app.roommate_preferences import save_validated_preference_for_owner

    # Given นักศึกษาระบุข้อมูลความต้องการครบแล้ว
    store = RoommatePreferenceStore()
    air_payload = {
        "room_type": "airConditioned",
        "room_occupants": 4,
        "sleep_behavior": "กรน",
        "cleanliness": "สะอาดมาก",
        "sleep_time": "22:00–00:00",
        "additional_text": "",
    }

    # When นักศึกษากดยืนยัน
    saved_air = save_validated_preference_for_owner("student-air", air_payload, store)

    # Then ระบบบันทึกข้อมูลสำหรับเจ้าของและรับค่าขอบเขต
    assert store.get_for_owner("student-air") is saved_air
    assert saved_air.room_occupants == 4
    assert saved_air.room_type == "airConditioned"

    fan_payload = dict(air_payload)
    fan_payload["room_type"] = "fan"
    fan_payload["room_occupants"] = 3
    saved_fan = save_validated_preference_for_owner("student-fan", fan_payload, store)
    assert store.get_for_owner("student-fan") is saved_fan
    assert saved_fan.room_occupants == 3


def test_AC_RPS_04A_updates_only_authenticated_owner_preferences():
    from app.roommate_preferences import RoommatePreferenceStore, receive_preference_for_owner

    # Given นักศึกษามีข้อมูลความต้องการที่บันทึกไว้
    store = RoommatePreferenceStore()
    original = receive_preference_for_owner(
        "student-1",
        {
            "room_type": "airConditioned",
            "room_occupants": 2,
            "sleep_behavior": "กรน",
            "cleanliness": "สะอาดมาก",
            "sleep_time": "22:00–00:00",
            "additional_text": "",
        },
        store,
    )

    # When เจ้าของแก้ข้อมูลเป็นค่าขอบเขตและยืนยัน
    updated = RoommatePreference(
        owner_id="student-1",
        room_type="fan",
        room_occupants=3,
        sleep_behavior="นอนดิ้น",
        cleanliness="ปานกลาง",
        sleep_time="หลัง 00:00",
        additional_text="ห้องเงียบ",
    )
    saved = store.update_for_owner("student-1", updated)

    # Then ระบบบันทึกข้อมูลใหม่และไม่เปลี่ยน record ของคนอื่น
    assert store.get_for_owner("student-1") is saved
    assert saved is not original
    assert saved.room_occupants == 3
    assert saved.room_type == "fan"
    assert store.get_for_owner("student-2") is None

    # แล้วปฏิเสธเมื่อเป้าหมายเป็น owner คนอื่น
    attempted = RoommatePreference(
        owner_id="student-2",
        room_type="airConditioned",
        room_occupants=4,
    )
    try:
        store.update_for_owner("student-1", attempted)
    except PermissionError:
        pass
    else:
        raise AssertionError("ควรปฏิเสธการแก้ไขข้อมูลของเจ้าของคนอื่น")


def test_AC_RPS_04A_update_endpoint_allows_owner_and_rejects_other_user(roommate_preference_api):
    client, _ = roommate_preference_api
    existing_store = RoommatePreferenceStore()
    existing_store.save_for_owner(
        RoommatePreference(
            owner_id="student-1",
            room_type="airConditioned",
            room_occupants=2,
        )
    )
    client.app.state.roommate_preference_store = existing_store
    payload = {
        "room_type": "fan",
        "room_occupants": 3,
        "sleep_behavior": "นอนดิ้น",
        "cleanliness": "ปานกลาง",
        "sleep_time": "หลัง 00:00",
        "additional_text": "ห้องเงียบ",
    }

    # Given นักศึกษาเป็นเจ้าของข้อมูลตนเอง
    owner_response = client.put(
        "/api/roommate-preferences/student-1",
        headers={"X-Test-User": "student-1"},
        json=payload,
    )

    # When เจ้าของแก้ไขและยืนยันข้อมูลที่ถูกต้อง
    # Then ระบบบันทึกข้อมูลใหม่
    assert owner_response.status_code == 200
    assert owner_response.json()["preference"]["room_occupants"] == 3
    assert owner_response.json()["preference"]["room_type"] == "fan"

    # When นักศึกษาอื่นพยายามแก้ไข
    other_response = client.put(
        "/api/roommate-preferences/student-1",
        headers={"X-Test-User": "student-2"},
        json=payload,
    )

    # Then ระบบปฏิเสธการเข้าถึง
    assert other_response.status_code == 403


def test_AC_RPS_04B_preserves_original_preference_when_update_persistence_fails():
    # Given มีข้อมูลเดิมและข้อมูลใหม่ถูกต้อง
    store = RoommatePreferenceStore()
    original = RoommatePreference(
        owner_id="student-1",
        room_type="airConditioned",
        room_occupants=2,
        cleanliness="สะอาดมาก",
    )
    store.save_for_owner(original)
    replacement = RoommatePreference(
        owner_id="student-1",
        room_type="fan",
        room_occupants=3,
        cleanliness="ปานกลาง",
    )

    def failing_persist(_preference):
        raise RuntimeError("save failed")

    # When การบันทึกข้อมูลล้มเหลว
    try:
        store.update_for_owner_atomically(
            "student-1",
            replacement,
            persist=failing_persist,
        )
    except RuntimeError:
        pass
    else:
        raise AssertionError("ควรแจ้งเมื่อ persistence ล้มเหลว")

    # Then คงข้อมูลเดิมและไม่บันทึกข้อมูลบางส่วน
    assert store.get_for_owner("student-1") is original


def test_AC_RPS_04B_preserves_original_when_single_field_persistence_fails():
    store = RoommatePreferenceStore()
    original = RoommatePreference(
        owner_id="student-1",
        room_type="airConditioned",
        room_occupants=2,
        additional_text="ข้อมูลเดิม",
    )
    store.save_for_owner(original)
    replacement = RoommatePreference(
        owner_id="student-1",
        room_type="airConditioned",
        room_occupants=2,
        additional_text="ข้อมูลใหม่",
    )

    try:
        store.update_for_owner_atomically(
            "student-1",
            replacement,
            persist=lambda _preference: (_ for _ in ()).throw(RuntimeError("save failed")),
        )
    except RuntimeError:
        pass

    assert store.get_for_owner("student-1") is original
    assert store.get_for_owner("student-1").additional_text == "ข้อมูลเดิม"


def test_AC_RPS_01_authenticated_profile_receives_preference_options(roommate_preference_api):
    # Given นักศึกษาเข้าสู่ระบบแล้วและมีโปรไฟล์หาเมท
    client, session_factory = roommate_preference_api
    _create_profile(session_factory, "student-1001")

    # When นักศึกษาเรียกดูตัวเลือกความต้องการหาเมท
    response = client.get(
        "/api/roommate-preferences",
        headers={"X-Test-User": "student-1001"},
    )

    # Then ระบบแสดงตัวเลือกความต้องการ
    assert response.status_code == 200
    assert response.json() == {"options": ROOMMATE_PREFERENCE_CONFIG}


def test_AC_RPS_07_identifies_student_without_roommate_profile(roommate_preference_api):
    # Given นักศึกษาเข้าสู่ระบบแล้วแต่ยังไม่มีโปรไฟล์หาเมท
    client, _ = roommate_preference_api

    # When นักศึกษาเรียกดูตัวเลือกความต้องการหาเมท
    response = client.get(
        "/api/roommate-preferences",
        headers={"X-Test-User": "student-404"},
    )

    # Then ระบบระบุสถานะ missing_profile
    assert response.status_code == 200
    assert response.json() == {"status": "missing_profile"}


def test_T04_rejects_missing_authenticated_identity(roommate_preference_api):
    client, _ = roommate_preference_api

    response = client.get("/api/roommate-preferences")

    assert response.status_code == 401


def test_AC_RPS_04_saves_for_authenticated_owner_without_owner_id(roommate_preference_api):
    client, _ = roommate_preference_api

    response = client.post(
        "/api/roommate-preferences",
        headers={"X-Test-User": "student-1001"},
        json={
            "room_type": "airConditioned",
            "room_occupants": 2,
            "sleep_behavior": "กรน",
        },
    )

    assert response.status_code == 200
    assert response.json()["preference"]["owner_id"] == "student-1001"
    assert response.json()["preference"]["room_occupants"] == 2


def test_TC_RPS_06_1_rejects_other_users_preferences(roommate_preference_api):
    client, _ = roommate_preference_api
    store = RoommatePreferenceStore()
    store.save_for_owner(
        RoommatePreference(
            owner_id="student-1",
            room_type="airConditioned",
            room_occupants=2,
        )
    )
    client.app.state.roommate_preference_store = store

    # Given นักศึกษาเข้าถึงข้อมูลของตนเองและของนักศึกษาอื่น
    # When พยายามอ่านข้อมูลของ student-1 ในฐานะ student-2
    response = client.get(
        "/api/roommate-preferences/student-1",
        headers={"X-Test-User": "student-2"},
    )

    # Then ระบบปฏิเสธการเข้าถึง
    assert response.status_code == 403


def test_TC_RPS_06_2_allows_owner_to_manage_preferences(roommate_preference_api):
    client, _ = roommate_preference_api
    store = RoommatePreferenceStore()
    store.save_for_owner(
        RoommatePreference(
            owner_id="student-1",
            room_type="airConditioned",
            room_occupants=2,
        )
    )
    client.app.state.roommate_preference_store = store

    # Given นักศึกษาเป็นเจ้าของข้อมูล
    read_response = client.get(
        "/api/roommate-preferences/student-1",
        headers={"X-Test-User": "student-1"},
    )

    # When เจ้าของอ่านข้อมูลและบันทึกข้อมูลของตนเอง
    save_response = client.post(
        "/api/roommate-preferences",
        headers={"X-Test-User": "student-1"},
        json={
            "owner_id": "student-1",
            "room_type": "fan",
            "room_occupants": 3,
            "sleep_behavior": "นอนดิ้น",
            "cleanliness": "ปานกลาง",
            "sleep_time": "หลัง 00:00",
            "additional_text": "ห้องเงียบ",
        },
    )

    # Then ระบบอนุญาตให้เจ้าของจัดการข้อมูลตนเอง
    assert read_response.status_code == 200
    assert read_response.json()["preference"]["owner_id"] == "student-1"
    assert save_response.status_code == 200
    assert save_response.json()["preference"]["room_occupants"] == 3


def test_TC_RPS_06_3_rejects_unauthenticated_access(roommate_preference_api):
    client, _ = roommate_preference_api

    # Given นักศึกษายังไม่ได้เข้าสู่ระบบ
    read_response = client.get("/api/roommate-preferences/student-1")
    save_response = client.post(
        "/api/roommate-preferences",
        json={
            "room_type": "fan",
            "room_occupants": 3,
        },
    )
    update_response = client.put(
        "/api/roommate-preferences/student-1",
        json={
            "room_type": "fan",
            "room_occupants": 3,
        },
    )

    # When พยายามอ่าน บันทึก หรือแก้ไข
    # Then ระบบปฏิเสธทุก operation
    assert read_response.status_code == 401
    assert save_response.status_code == 401
    assert update_response.status_code == 401
