from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService


def test_TC_SRS_03B_1_lists_all_open_profiles_without_own():
    # Given นักศึกษาอยู่ในหน้าค้นหาเมทและมีโปรไฟล์ของหลายคนที่เปิดสถานะให้ค้นหา รวมถึงโปรไฟล์ของผู้ค้นหาเอง
    service = SearchRoommateService()

    # When นักศึกษาไม่เลือกตัวกรองและกดค้นหา
    results = service.query_roommates("user-1", filters={})

    # Then ระบบแสดงโปรไฟล์ทั้งหมดที่เจ้าของเปิดสถานะให้ค้นหา; ระบบไม่แสดงโปรไฟล์ของผู้ค้นหาเอง
    assert {profile.user_id for profile in results} == {"user-2", "user-4"}
    assert all(profile.is_open_for_search for profile in results)
    assert all(profile.user_id != "user-1" for profile in results)


def test_TC_SRS_03B_2_lists_single_open_profile_without_filters():
    # Given นักศึกษาอยู่ในหน้าค้นหาเมทและมีโปรไฟล์เปิดให้ค้นหาของผู้อื่นตรงตามเงื่อนไขโดยรวมเพียง 1 โปรไฟล์
    open_profile = SearchRoommateProfile(
        user_id="user-2",
        name="โปรไฟล์ที่เปิด",
        age=21,
        gender="หญิง",
        faculty="วิศวกรรมศาสตร์",
        academic_year="2",
        room_type="ห้องแยก",
        room_size=2,
        is_open_for_search=True,
    )
    service = SearchRoommateService(profiles=[open_profile])

    # When นักศึกษาไม่เลือกตัวกรองและกดค้นหา
    results = service.query_roommates("user-1", filters={})

    # Then ระบบแสดงโปรไฟล์ที่เปิดสถานะของผู้อื่น; ระบบไม่แสดงโปรไฟล์ผู้ค้นหาเอง
    assert [profile.user_id for profile in results] == ["user-2"]
    assert all(profile.user_id != "user-1" for profile in results)


def test_TC_SRS_03B_3_rejects_unauthenticated_unfiltered_search():
    # Given นักศึกษายังไม่ได้เข้าสู่ระบบและไม่ได้อยู่ในหน้าค้นหาเมท
    from fastapi.testclient import TestClient

    from app.api.search import app

    client = TestClient(app)

    # When นักศึกษาพยายามค้นหาโดยไม่เลือกตัวกรอง
    response = client.post(
        "/search-roommates",
        json={"current_user_id": "", "filters": {}, "mode": "AND"},
    )

    # Then ระบบปฏิเสธการเข้าใช้งานและให้นักศึกษาเข้าสู่ระบบก่อน (AC-SRS-06)
    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required to search for roommates."
