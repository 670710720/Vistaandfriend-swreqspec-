from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage


class ChatRepository:
    """Stores participant-scoped chat records for FR-CHAT-01 and CON-PRIV-01."""

    @staticmethod
    def create_message(
        db: Session,
        *,
        sender_id: str,
        receiver_id: str,
        content: str,
    ) -> ChatMessage:
        message = ChatMessage(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message

    @staticmethod
    def list_messages(
        db: Session,
        *,
        sender_id: str | None = None,
        receiver_id: str | None = None,
    ) -> Sequence[ChatMessage]:
        stmt = select(ChatMessage)

        if sender_id is not None and receiver_id is not None:
            pair_condition = or_(
                and_(ChatMessage.sender_id == sender_id, ChatMessage.receiver_id == receiver_id),
                and_(ChatMessage.sender_id == receiver_id, ChatMessage.receiver_id == sender_id),
            )
            stmt = stmt.where(pair_condition)
        elif sender_id is not None:
            stmt = stmt.where(
                or_(ChatMessage.sender_id == sender_id, ChatMessage.receiver_id == sender_id)
            )
        elif receiver_id is not None:
            stmt = stmt.where(
                or_(ChatMessage.sender_id == receiver_id, ChatMessage.receiver_id == receiver_id)
            )

        stmt = stmt.order_by(ChatMessage.created_at.asc())
        return db.execute(stmt).scalars().all()
