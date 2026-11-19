from sqlalchemy import text

from app.database import create_database


def test_T01_sqlite_connection_and_profile_session(tmp_path):
    engine, session_factory = create_database(
        f"sqlite:///{tmp_path / 'roommate-profile.db'}"
    )

    try:
        with engine.connect() as connection:
            assert connection.execute(text("SELECT 1")).scalar_one() == 1
        with session_factory() as session:
            assert session.execute(text("SELECT 1")).scalar_one() == 1
    finally:
        engine.dispose()
