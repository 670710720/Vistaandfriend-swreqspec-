"""Database setup for profile and chat persistence."""

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.models.chat_message import Base
from app.models.roommate_profile import RoommateProfile

__all__ = ["Base", "RoommateProfile", "create_database"]


def create_database(database_url: str) -> tuple[Engine, sessionmaker[Session]]:
    """Create the database engine and session factory for FR-RMP-08 and CON-DATA-01."""
    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
    )
    session_factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, session_factory
