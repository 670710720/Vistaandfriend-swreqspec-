from types import SimpleNamespace

from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService


def test_TC_SRS_03D_1_uses_owner_preferences_for_filters():
    # Given นักศึกษาระบุพฤติกรรมการนอน ความสะอาด และเวลาเข้านอนเป็นตัวกรอง; โปรไฟล์ผู้สมัครมีข้อมูลโปรไฟล์และความต้องการที่ต่างกัน
    matching_profile = SearchRoommateProfile(
        user_id="matching",
        name="ตรงตามความต้องการ",
        age=21,
        gender="หญิง",
        faculty="วิศวกรรมศาสตร์",
        academic_year="2",
        room_type="ห้องแยก",
        room_size=2,
        sleep_behavior="กรน",
        cleanliness="สะอาด",
        sleep_time="22:30",
    )
    non_matching_profile = SearchRoommateProfile(
        user_id="non-matching",
        name="ไม่ตรงตามความต้องการ",
        age=20,
        gender="ชาย",
        faculty="วิทยาศาสตร์",
        academic_year="1",
        room_type="ห้องรวม",
        room_size=4,
        sleep_behavior="กัดฟัน",
        cleanliness="ไม่สะอาด",
        sleep_time="00:15",
    )
    service = SearchRoommateService(profiles=[matching_profile, non_matching_profile])

    # When นักศึกษากดค้นหา
    results = service.query_roommates(
        "searcher",
        filters={
            "sleep_behavior": "กรน",
            "cleanliness": "สะอาด",
            "sleep_time": "22:30",
        },
        mode="AND",
    )

    # Then ระบบเปรียบเทียบตัวกรองทั้งสามกับข้อมูลความต้องการหาเมทของเจ้าของโปรไฟล์
    assert [profile.user_id for profile in results] == ["matching"]
    assert results[0].sleep_behavior == "กรน"
    assert results[0].cleanliness == "สะอาด"
    assert results[0].sleep_time == "22:30"


def test_TC_SRS_03D_2_uses_preference_data_for_single_filter():
    # Given นักศึกษาระบุพฤติกรรมการนอนเป็นตัวกรองเพียง 1 รายการ; ข้อมูลพฤติกรรมในโปรไฟล์เจ้าของต่างจากข้อมูลความต้องการของเจ้าของ
    preference_match = SimpleNamespace(
        user_id="preference-match",
        name="ความต้องการตรง",
        age=21,
        gender="หญิง",
        faculty="วิศวกรรมศาสตร์",
        academic_year="2",
        room_type="ห้องแยก",
        room_size=2,
        is_open_for_search=True,
        sleep_behavior="กรน",
        profile_sleep_behavior="นอนดิ้น",
    )
    profile_only_match = SimpleNamespace(
        user_id="profile-only-match",
        name="ตรงเฉพาะข้อมูลโปรไฟล์",
        age=20,
        gender="หญิง",
        faculty="วิทยาศาสตร์",
        academic_year="1",
        room_type="ห้องรวม",
        room_size=4,
        is_open_for_search=True,
        sleep_behavior="กัดฟัน",
        profile_sleep_behavior="กรน",
    )
    service = SearchRoommateService(profiles=[preference_match, profile_only_match])

    # When นักศึกษากดค้นหา
    results = service.query_roommates(
        "searcher",
        filters={"sleep_behavior": "กรน"},
        mode="AND",
    )

    # Then ระบบเปรียบเทียบตัวกรองกับข้อมูลความต้องการหาเมทของเจ้าของโปรไฟล์ ไม่ใช้พฤติกรรมในข้อมูลโปรไฟล์แทน
    assert [profile.user_id for profile in results] == ["preference-match"]
    assert results[0].sleep_behavior == "กรน"
    assert results[0].profile_sleep_behavior != "กรน"
    assert all(profile.user_id != "profile-only-match" for profile in results)


def test_TC_SRS_03D_3_uses_profile_data_for_age_filter():
    # Given นักศึกษาระบุเฉพาะตัวกรองอายุจากข้อมูลโปรไฟล์ ไม่ได้ระบุพฤติกรรมการนอน ความสะอาด หรือเวลาเข้านอน
    matching_profile = SearchRoommateProfile(
        user_id="age-match",
        name="อายุที่ตรง",
        age=21,
        gender="หญิง",
        faculty="วิศวกรรมศาสตร์",
        academic_year="2",
        room_type="ห้องแยก",
        room_size=2,
        sleep_behavior="กรน",
        cleanliness="สะอาด",
        sleep_time="22:30",
    )
    other_age_profile = SearchRoommateProfile(
        user_id="other-age",
        name="อายุไม่ตรง",
        age=20,
        gender="หญิง",
        faculty="วิศวกรรมศาสตร์",
        academic_year="2",
        room_type="ห้องแยก",
        room_size=2,
        sleep_behavior="กรน",
        cleanliness="สะอาด",
        sleep_time="22:30",
    )
    service = SearchRoommateService(profiles=[matching_profile, other_age_profile])

    # When นักศึกษากดค้นหา
    results = service.query_roommates("searcher", filters={"age": 21}, mode="AND")

    # Then ระบบเปรียบเทียบตัวกรองอายุกับข้อมูลโปรไฟล์ของเจ้าของ (กติกาแหล่งข้อมูลตัวกรองใน spec)
    assert [profile.user_id for profile in results] == ["age-match"]
    assert results[0].age == 21
