"""SQLAlchemy model for FR-RMP-03/04/08/11 and CON-PROFILE-01, CON-DATA-01,
CON-DISCOVER-01.
"""

from sqlalchemy import Boolean, Integer, JSON, LargeBinary, String, Text, false, true
from sqlalchemy.orm import Mapped, mapped_column

from app.config import PROFILE_DISCOVERY_DEFAULT
from app.models.chat_message import Base


class RoommateProfile(Base):
    """Persist profile data with owner uniqueness and an unpublished default."""

    __tablename__ = "roommate_profiles"

    user_id: Mapped[str] = mapped_column(String, primary_key=True)
    nickname: Mapped[str] = mapped_column(Text, nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String, nullable=False)
    faculty: Mapped[str] = mapped_column(Text, nullable=False)
    academic_year: Mapped[str] = mapped_column(Text, nullable=False)
    profile_image: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    phone: Mapped[str] = mapped_column(String, nullable=False)
    facebook: Mapped[str | None] = mapped_column(Text, nullable=True)
    instagram: Mapped[str | None] = mapped_column(Text, nullable=True)
    line: Mapped[str | None] = mapped_column(Text, nullable=True)
    tiktok: Mapped[str | None] = mapped_column(Text, nullable=True)
    room_type: Mapped[str] = mapped_column(String, nullable=False)
    room_occupants: Mapped[int] = mapped_column(Integer, nullable=False)
    sleep_behaviors: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    other_sleep_behavior: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_searchable: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=PROFILE_DISCOVERY_DEFAULT,
        server_default=true() if PROFILE_DISCOVERY_DEFAULT else false(),
    )
