import pytest
from sqlalchemy.exc import IntegrityError

from app.database import Base, create_database
from app.models.roommate_profile import RoommateProfile


def _create_profile(user_id: str) -> RoommateProfile:
    # Supports FR-RMP-03, FR-RMP-04, and CON-PROFILE-01 test setup.
    return RoommateProfile(
        user_id=user_id,
        nickname="น้องเมท",
        age=20,
        gender="หญิง",
        faculty="วิทยาศาสตร์",
        academic_year="1",
        profile_image=b"\x89PNG\r\n\x1a\nprofile",
        phone="0812345678",
        room_type="ห้องแอร์",
        room_occupants=2,
        sleep_behaviors=["กรน"],
    )


def test_AC_RMP_05B_new_profile_is_persisted_unsearchable(tmp_path):
    engine, session_factory = create_database(
        f"sqlite:///{tmp_path / 'roommate-profile.db'}"
    )
    Base.metadata.create_all(bind=engine)

    try:
        with session_factory.begin() as session:
            session.add(_create_profile("student-1"))

        with session_factory() as session:
            profile = session.get(RoommateProfile, "student-1")

        assert profile is not None
        assert profile.is_searchable is False
        assert profile.profile_image == b"\x89PNG\r\n\x1a\nprofile"
    finally:
        engine.dispose()


def test_CON_PROFILE_01_owner_cannot_have_a_second_profile(tmp_path):
    engine, session_factory = create_database(
        f"sqlite:///{tmp_path / 'roommate-profile-unique.db'}"
    )
    Base.metadata.create_all(bind=engine)

    try:
        with session_factory.begin() as session:
            session.add(_create_profile("student-1"))

        with pytest.raises(IntegrityError):
            with session_factory.begin() as session:
                session.add(_create_profile("student-1"))
    finally:
        engine.dispose()
