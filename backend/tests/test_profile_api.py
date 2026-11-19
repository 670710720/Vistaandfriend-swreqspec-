from io import BytesIO

import pytest
from sqlalchemy import func, select
from starlette.datastructures import UploadFile

from app.config import PROFILE_AGE_MIN, PROFILE_IMAGE_MAX_BYTES, ROOM_OCCUPANCY_LIMITS
from app.database import Base, create_database
from app.models.roommate_profile import RoommateProfile
from app.roommate_profiles import ProfilePersistenceError, save_roommate_profile


def _valid_profile():
    # AC-RMP-05/05B: provide valid profile data for atomic save tests.
    return {
        "nickname": "เมท",
        "age": str(PROFILE_AGE_MIN),
        "gender": "หญิง",
        "faculty": "วิทยาศาสตร์",
        "academicYear": "1",
        "profileImage": UploadFile(
            file=BytesIO(b"image-bytes"),
            size=PROFILE_IMAGE_MAX_BYTES,
            filename="profile.png",
            headers={"content-type": "image/png"},
        ),
        "phone": "0812345678",
        "roomType": "airConditioned",
        "occupants": str(ROOM_OCCUPANCY_LIMITS["airConditioned"]["min"]),
        "sleepBehaviors": ["กรน"],
        "otherSleepBehavior": "",
        "social": {"Facebook": "student", "Instagram": "", "LINE": "", "TikTok": ""},
    }


def test_AC_RMP_05_persists_profile_and_returns_successful_record(tmp_path):
    engine, session_factory = create_database(
        f"sqlite:///{tmp_path / 'roommate-profile-api.db'}"
    )
    Base.metadata.create_all(bind=engine)

    try:
        with session_factory() as session:
            profile = save_roommate_profile(
                session,
                owner_id="student-1",
                values=_valid_profile(),
            )
            assert profile.user_id == "student-1"
            assert profile.nickname == "เมท"
            assert profile.facebook == "student"
            assert profile.is_searchable is False
            assert profile.profile_image == b"image-bytes"

        with session_factory() as session:
            stored = session.get(RoommateProfile, "student-1")

        assert stored is not None
        assert stored.profile_image == b"image-bytes"
    finally:
        engine.dispose()


def test_AC_RMP_05A_rolls_back_failed_save_and_allows_retry_once(tmp_path):
    engine, session_factory = create_database(
        f"sqlite:///{tmp_path / 'roommate-profile-retry.db'}"
    )
    Base.metadata.create_all(bind=engine)

    try:
        with engine.begin() as connection:
            connection.exec_driver_sql(
                "CREATE TRIGGER force_profile_insert_failure "
                "BEFORE INSERT ON roommate_profiles "
                "BEGIN SELECT RAISE(ABORT, 'forced failure'); END"
            )

        with session_factory() as session:
            with pytest.raises(ProfilePersistenceError):
                save_roommate_profile(
                    session,
                    owner_id="student-1",
                    values=_valid_profile(),
                )
            assert session.scalar(
                select(func.count()).select_from(RoommateProfile)
            ) == 0

        with engine.begin() as connection:
            connection.exec_driver_sql("DROP TRIGGER force_profile_insert_failure")

        with session_factory() as session:
            save_roommate_profile(
                session,
                owner_id="student-1",
                values=_valid_profile(),
            )
            assert session.scalar(
                select(func.count()).select_from(RoommateProfile)
            ) == 1
    finally:
        engine.dispose()


def test_AC_RMP_05B_persists_new_profile_with_search_disabled(tmp_path):
    engine, session_factory = create_database(
        f"sqlite:///{tmp_path / 'roommate-profile-hidden.db'}"
    )
    Base.metadata.create_all(bind=engine)

    try:
        with session_factory() as session:
            save_roommate_profile(
                session,
                owner_id="student-1",
                values=_valid_profile(),
            )
            stored = session.get(RoommateProfile, "student-1")

        assert stored is not None
        assert stored.is_searchable is False
    finally:
        engine.dispose()
