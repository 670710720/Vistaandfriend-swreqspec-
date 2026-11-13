from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sender_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    receiver_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    def to_read_model(self) -> "ChatMessageRead":
        return ChatMessageRead(
            id=self.id,
            sender_id=self.sender_id,
            receiver_id=self.receiver_id,
            content=self.content,
            created_at=self.created_at,
        )


class ChatMessageCreate(BaseModel):
    sender_id: str = Field(..., min_length=1, max_length=100)
    receiver_id: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1, max_length=2000)


class ChatMessageRead(BaseModel):
    id: int
    sender_id: str
    receiver_id: str
    content: str
    created_at: datetime
