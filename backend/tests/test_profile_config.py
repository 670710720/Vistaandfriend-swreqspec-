from app import config


def test_T03_profile_config_covers_specified_validation_values():
    assert config.PROFILE_REQUIRED_FIELDS == (
        "nickname",
        "age",
        "gender",
        "faculty",
        "academicYear",
        "profileImage",
        "phone",
        "roomType",
        "occupants",
        "sleepBehaviors",
    )
    assert (config.PROFILE_AGE_MIN, config.PROFILE_AGE_MAX) == (18, 25)
    assert config.PROFILE_GENDERS == ("หญิง", "ชาย")
    assert config.PROFILE_FACULTIES == (
        "วิทยาศาสตร์",
        "เภสัชศาสตร์",
        "วิศวกรรมศาสตร์",
        "อักษรศาสตร์",
        "มัณฑนศิลป์",
        "ศิลปกรรม",
        "ศึกษาศาสตร์",
        "จิตรกรรม",
    )
    assert config.PROFILE_YEAR_OPTIONS == ("1", "2", "3", "4", "5 ขึ้นไป")
    assert config.PROFILE_IMAGE_FORMATS == ("image/jpeg", "image/png")
    assert config.PROFILE_IMAGE_MAX_MB == 5
    assert config.PROFILE_IMAGE_CHECK_DIMENSIONS is False
    assert config.PROFILE_PHONE_DIGITS == 10
    assert config.PROFILE_PHONE_SEPARATORS == (" ", "-")
    assert config.PROFILE_SOCIAL_CHANNELS == (
        "Facebook",
        "Instagram",
        "LINE",
        "TikTok",
    )
    assert config.PROFILE_SOCIAL_INPUT_FORMATS == ("username", "url")
    assert config.ROOM_OCCUPANCY_LIMITS == {
        "airConditioned": {"min": 1, "max": 4},
        "fan": {"min": 1, "max": 3},
    }
    assert config.SLEEP_BEHAVIOR_OPTIONS == (
        "กรน",
        "กัดฟัน",
        "นอนดิ้น",
        "ไม่มีพฤติกรรมดังกล่าว",
        "อื่น ๆ",
    )
    assert config.SLEEP_MIN_SELECTIONS == 1
    assert config.SLEEP_NONE_EXCLUSIVE == "ไม่มีพฤติกรรมดังกล่าว"
    assert config.SLEEP_OTHER_REQUIRES_DESCRIPTION == "อื่น ๆ"
    assert config.PROFILE_DISCOVERY_DEFAULT is False
    assert config.USABILITY_TEST_PARTICIPANTS == 5
    assert config.USABILITY_TEST_SUCCESS_RATE == 0.8
