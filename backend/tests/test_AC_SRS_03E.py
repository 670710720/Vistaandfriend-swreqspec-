from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService


def build_profiles(count):
    return [
        SearchRoommateProfile(
            user_id=f"user-{index}",
            name=f"นักศึกษา {index}",
            age=20 + index % 5,
            gender="หญิง" if index % 2 == 0 else "ชาย",
            faculty="วิศวกรรมศาสตร์",
            academic_year="2",
            room_type="ห้องแยก",
            room_size=2,
        )
        for index in range(2, count + 2)
    ]


def test_TC_SRS_03E_1_new_search_starts_page_one():
    # Given นักศึกษาอยู่หน้าผลการค้นหาหน้า 3 และมีผลลัพธ์อย่างน้อย 20 รายการสำหรับคำค้นหาใหม่
    service = SearchRoommateService(profiles=build_profiles(45))
    previous_page = service.query_roommates("user-1", filters={}, page=3)

    # When นักศึกษาแก้ไขตัวกรองและส่งคำค้นหาใหม่
    new_search_results = service.query_roommates(
        "user-1",
        filters={"gender": "หญิง"},
        page=1,
    )

    # Then ระบบเริ่มแสดงผลลัพธ์ที่หน้า 1; ระบบแสดงหน้าละ 20 รายการ
    assert previous_page[0].user_id != new_search_results[0].user_id
    assert len(new_search_results) == 20
    assert new_search_results[0].user_id == "user-2"


def test_TC_SRS_03E_2_displays_exactly_20_results_on_page_one():
    # Given นักศึกษาส่งคำค้นหาใหม่ที่มีผลลัพธ์ตรงทั้งหมด 20 รายการ
    service = SearchRoommateService(profiles=build_profiles(20))

    # When ระบบแสดงผลคำค้นหาใหม่
    results = service.query_roommates("user-1", filters={}, page=1)

    # Then ระบบเริ่มที่หน้า 1; ระบบแสดง 20 รายการในหน้านั้น
    assert len(results) == 20
    assert results[0].user_id == "user-2"
    assert results[-1].user_id == "user-21"


def test_TC_SRS_03E_3_paginates_21_results():
    # Given นักศึกษาส่งคำค้นหาใหม่ที่มีผลลัพธ์ตรงทั้งหมด 21 รายการ
    service = SearchRoommateService(profiles=build_profiles(21))

    # When ระบบแสดงผลคำค้นหาใหม่และนักศึกษาเปิดหน้าถัดไป
    first_page = service.query_roommates("user-1", filters={}, page=1)
    second_page = service.query_roommates("user-1", filters={}, page=2)

    # Then ระบบเริ่มที่หน้า 1 และแสดง 20 รายการ; หน้าถัดไปแสดงรายการที่เหลือ 1 รายการ
    assert len(first_page) == 20
    assert first_page[0].user_id == "user-2"
    assert len(second_page) == 1
    assert second_page[0].user_id == "user-22"


def test_TC_SRS_03E_4_new_search_from_search_page():
    # Given นักศึกษาอยู่หน้าค้นหาเมทก่อนมีหน้าผลลัพธ์
    service = SearchRoommateService(profiles=build_profiles(25))

    # When นักศึกษาแก้ไขตัวกรองหรือส่งคำค้นหาใหม่
    results = service.query_roommates(
        "user-1",
        filters={"gender": "หญิง"},
        page=1,
    )

    # Then ระบบเริ่มแสดงผลคำค้นหาใหม่ที่หน้า 1; ระบบแสดงหน้าละ 20 รายการ
    assert results[0].user_id == "user-2"
    assert len(results) == 13
