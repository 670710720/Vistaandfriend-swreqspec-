from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService


def test_TC_SRS_03A_1_filters_closed_and_own_profiles():
    # Given มีโปรไฟล์ของนักศึกษาหลายคน ทั้งที่เปิดและไม่เปิดสถานะให้ค้นหา และมีโปรไฟล์ของผู้ค้นหาเอง
    profiles = [
        SearchRoommateProfile(
            user_id="user-1",
            name="ผู้ค้นหา",
            age=22,
            gender="หญิง",
            faculty="วิศวกรรมศาสตร์",
            academic_year="2",
            room_type="ห้องแยก",
            room_size=2,
            is_open_for_search=True,
        ),
        SearchRoommateProfile(
            user_id="user-2",
            name="โปรไฟล์ที่เปิด",
            age=21,
            gender="หญิง",
            faculty="วิศวกรรมศาสตร์",
            academic_year="2",
            room_type="ห้องแยก",
            room_size=2,
            is_open_for_search=True,
        ),
        SearchRoommateProfile(
            user_id="user-3",
            name="โปรไฟล์ที่ปิด",
            age=23,
            gender="ชาย",
            faculty="แพทยศาสตร์",
            academic_year="3",
            room_type="ห้องรวม",
            room_size=4,
            is_open_for_search=False,
        ),
    ]
    service = SearchRoommateService(profiles=profiles)

    # When นักศึกษาค้นหาเมท
    results = service.query_roommates("user-1")

    # Then ระบบแสดงเฉพาะโปรไฟล์ที่เจ้าของเปิดสถานะ; ระบบไม่แสดงโปรไฟล์ของผู้ค้นหาเอง
    assert [profile.user_id for profile in results] == ["user-2"]
    assert all(profile.is_open_for_search for profile in results)
    assert all(profile.user_id != "user-1" for profile in results)


def test_TC_SRS_03A_2_includes_single_open_profile():
    # Given มีโปรไฟล์ของผู้สมัครคนอื่นที่เปิดสถานะให้ค้นหาเพียง 1 โปรไฟล์
    profile = SearchRoommateProfile(
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
    service = SearchRoommateService(profiles=[profile])

    # When นักศึกษาค้นหาเมท
    results = service.query_roommates("user-1")

    # Then ระบบแสดงโปรไฟล์ที่เปิดสถานะนั้น
    assert [result.user_id for result in results] == ["user-2"]
    assert results[0].is_open_for_search is True


def test_TC_SRS_03A_3_excludes_only_own_profile():
    # Given มีเพียงโปรไฟล์ของผู้ค้นหาเองและเจ้าของเปิดสถานะให้ค้นหา
    own_profile = SearchRoommateProfile(
        user_id="user-1",
        name="ผู้ค้นหา",
        age=22,
        gender="หญิง",
        faculty="วิศวกรรมศาสตร์",
        academic_year="2",
        room_type="ห้องแยก",
        room_size=2,
        is_open_for_search=True,
    )
    service = SearchRoommateService(profiles=[own_profile])

    # When นักศึกษาค้นหาเมท
    results = service.query_roommates("user-1")

    # Then ระบบไม่แสดงโปรไฟล์ของผู้ค้นหาเอง
    assert all(result.user_id != "user-1" for result in results)
    assert results == []
