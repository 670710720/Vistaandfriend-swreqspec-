from __future__ import annotations

from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from pydantic import BaseModel, Field, field_validator
from sqlalchemy import Boolean, DateTime, Integer, String, Text, false
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.config import CHAT_MESSAGE_MAX_LENGTH, CHAT_MESSAGE_MIN_LENGTH, CHAT_TIMEZONE


class Base(DeclarativeBase):
    pass


class ChatMessage(Base):
    """Persists FR-CHAT-04/10 metadata with UTC storage and ASM-03 API time zone."""

    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sender_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    receiver_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=false(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    def to_read_model(self) -> "ChatMessageRead":
        # FR-CHAT-04/10, ASM-03: retain UTC storage and expose time-zone and Read metadata.
        created_at_utc = self.created_at
        if created_at_utc.tzinfo is None:
            created_at_utc = created_at_utc.replace(tzinfo=timezone.utc)

        return ChatMessageRead(
            id=self.id,
            sender_id=self.sender_id,
            receiver_id=self.receiver_id,
            content=self.content,
            is_read=self.is_read,
            created_at=created_at_utc.astimezone(ZoneInfo(CHAT_TIMEZONE)),
        )


class ChatMessageCreate(BaseModel):
    """Validates FR-CHAT-13 before any message reaches the repository."""

    sender_id: str = Field(..., min_length=1, max_length=100)
    receiver_id: str = Field(..., min_length=1, max_length=100)
    content: str = Field(
        ...,
        min_length=CHAT_MESSAGE_MIN_LENGTH,
        max_length=CHAT_MESSAGE_MAX_LENGTH,
    )

    @field_validator("content")
    @classmethod
    def reject_whitespace_only_content(cls, content: str) -> str:
        # FR-CHAT-13: reject whitespace-only text without altering valid message content.
        if not content.strip():
            raise ValueError("Message content must not be blank")
        return content


class ChatMessageRead(BaseModel):
    id: int
    sender_id: str
    receiver_id: str
    content: str
    is_read: bool
    created_at: datetime


class ChatMessageReadReceipt(BaseModel):
    """Response for the per-message Read operation in FR-CHAT-10."""

    id: int
    is_read: bool
