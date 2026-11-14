from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService


def test_TC_SRS_03C_1_applies_and_or_and_ranks_results():
    # Given นักศึกษาระบุหลายตัวกรองและเลือก AND หรือ OR; มีโปรไฟล์ที่ตรง 0, 1 หรือทุกตัวกรอง
    profiles = [
        SearchRoommateProfile(
            user_id="both",
            name="ตรงทั้งสอง",
            age=21,
            gender="หญิง",
            faculty="วิศวกรรมศาสตร์",
            academic_year="2",
            room_type="ห้องแยก",
            room_size=2,
        ),
        SearchRoommateProfile(
            user_id="one",
            name="ตรงหนึ่ง",
            age=21,
            gender="หญิง",
            faculty="วิทยาศาสตร์",
            academic_year="2",
            room_type="ห้องรวม",
            room_size=2,
        ),
        SearchRoommateProfile(
            user_id="none",
            name="ไม่ตรง",
            age=21,
            gender="ชาย",
            faculty="แพทยศาสตร์",
            academic_year="2",
            room_type="ห้องแยก",
            room_size=2,
        ),
    ]
    service = SearchRoommateService(profiles=profiles)
    filters = {"gender": "หญิง", "faculty": "วิศวกรรมศาสตร์"}

    # When นักศึกษากดค้นหาโดยทดสอบทั้ง AND และ OR
    and_results = service.query_roommates("searcher", filters=filters, mode="AND")
    or_results = service.query_roommates("searcher", filters=filters, mode="OR")

    # Then ระบบใช้ตัวดำเนินการเดียวกันกับทุกตัวกรอง
    assert [profile.user_id for profile in and_results] == ["both"]
    assert [profile.user_id for profile in or_results] == ["both", "one"]
    # AND แสดงเฉพาะโปรไฟล์ที่ตรงทุกตัวกรอง
    assert all(
        profile.gender == "หญิง" and profile.faculty == "วิศวกรรมศาสตร์"
        for profile in and_results
    )
    # OR แสดงเฉพาะโปรไฟล์ที่ตรงอย่างน้อยหนึ่งตัวกรอง
    assert all(
        profile.gender == "หญิง" or profile.faculty == "วิศวกรรมศาสตร์"
        for profile in or_results
    )
    assert all(profile.user_id != "none" for profile in or_results)
    # OR เรียงจำนวนตัวกรองที่ตรงจากมากไปน้อย
    assert [profile.user_id for profile in or_results] == ["both", "one"]


def test_TC_SRS_03C_2_handles_two_filter_match_boundary():
    # Given นักศึกษาระบุ 2 ตัวกรองและเลือก OR; มีโปรไฟล์หนึ่งตรง 2 ตัวกรองและอีกโปรไฟล์ตรงเพียง 1 ตัวกรอง
    profiles = [
        SearchRoommateProfile(
            user_id="both",
            name="ตรงสองตัวกรอง",
            age=21,
            gender="หญิง",
            faculty="วิศวกรรมศาสตร์",
            academic_year="2",
            room_type="ห้องแยก",
            room_size=2,
        ),
        SearchRoommateProfile(
            user_id="one",
            name="ตรงหนึ่งตัวกรอง",
            age=21,
            gender="ชาย",
            faculty="วิทยาศาสตร์",
            academic_year="2",
            room_type="ห้องรวม",
            room_size=2,
        ),
        SearchRoommateProfile(
            user_id="zero",
            name="ไม่ตรงตัวกรอง",
            age=20,
            gender="ชาย",
            faculty="แพทยศาสตร์",
            academic_year="3",
            room_type="ห้องรวม",
            room_size=4,
        ),
    ]
    service = SearchRoommateService(profiles=profiles)
    filters = {"age": 21, "room_type": "ห้องแยก"}

    # When นักศึกษากดค้นหา แล้วเปลี่ยนเป็น AND และค้นหาอีกครั้ง
    or_results = service.query_roommates("searcher", filters=filters, mode="OR")
    and_results = service.query_roommates("searcher", filters=filters, mode="AND")

    # Then OR แสดงทั้งสองโปรไฟล์และเรียงโปรไฟล์ที่ตรง 2 ตัวกรองก่อน
    assert [profile.user_id for profile in or_results] == ["both", "one"]
    assert all(profile.user_id != "zero" for profile in or_results)
    # AND แสดงเฉพาะโปรไฟล์ที่ตรงทั้ง 2 ตัวกรอง
    assert [profile.user_id for profile in and_results] == ["both"]
