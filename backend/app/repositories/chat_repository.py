from __future__ import annotations

from collections.abc import Sequence
from datetime import datetime, timedelta, timezone

from sqlalchemy import and_, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.chat_attachment import ChatAttachment
from app.models.chat_message import ChatMessage, ChatMessageRead


class ChatRepository:
    """Stores participant-scoped chat records for FR-CHAT-01, FR-CHAT-04 and CON-DATA-01."""

    @staticmethod
    def has_conversation(
        db: Session,
        *,
        sender_id: str,
        receiver_id: str,
    ) -> bool:
        # FR-CHAT-15, NFR-SEC-02: identify persisted history only for the requested participant pair.
        pair_condition = or_(
            and_(ChatMessage.sender_id == sender_id, ChatMessage.receiver_id == receiver_id),
            and_(ChatMessage.sender_id == receiver_id, ChatMessage.receiver_id == sender_id),
        )
        return db.execute(
            select(ChatMessage.id).where(pair_condition).limit(1)
        ).scalar_one_or_none() is not None

    @staticmethod
    def create_message(
        db: Session,
        *,
        sender_id: str,
        receiver_id: str,
        content: str,
    ) -> ChatMessageRead:
        # FR-CHAT-04, CON-DATA-01, CON-REL-01: commit before returning success and roll back failures.
        message = ChatMessage(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
        )
        try:
            db.add(message)
            db.flush()
            read_model = message.to_read_model()
            db.commit()
        except SQLAlchemyError:
            db.rollback()
            raise
        return read_model

    @staticmethod
    def create_message_with_attachment(
        db: Session,
        *,
        sender_id: str,
        receiver_id: str,
        content: str,
        original_filename: str,
        content_type: str,
        size_bytes: int,
        storage_key: str,
        retention_days: int,
    ) -> tuple[ChatMessageRead, ChatAttachment]:
        # AC-CHAT-02A, CON-DATA-01 and CON-REL-01: commit message and attachment metadata together.
        sent_at = datetime.now(timezone.utc)
        message = ChatMessage(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
            created_at=sent_at,
        )
        try:
            db.add(message)
            db.flush()
            attachment = ChatAttachment(
                message_id=message.id,
                original_filename=original_filename,
                content_type=content_type,
                size_bytes=size_bytes,
                storage_key=storage_key,
                expires_at=sent_at + timedelta(days=retention_days),
            )
            db.add(attachment)
            db.flush()
            read_model = message.to_read_model()
            db.commit()
        except SQLAlchemyError:
            db.rollback()
            raise
        return read_model, attachment

    @staticmethod
    def list_attachments(
        db: Session,
        *,
        message_ids: Sequence[int],
    ) -> Sequence[ChatAttachment]:
        # FR-CHAT-11: retrieve attachment metadata for the messages in a conversation.
        if not message_ids:
            return []
        stmt = select(ChatAttachment).where(ChatAttachment.message_id.in_(message_ids))
        return db.execute(stmt).scalars().all()

    @staticmethod
    def get_attachment(db: Session, attachment_id: int) -> ChatAttachment | None:
        # NFR-SEC-02: provide metadata for authorization before serving attachment bytes.
        return db.get(ChatAttachment, attachment_id)

    @staticmethod
    def mark_message_read(
        db: Session,
        *,
        message_id: int,
        reader_id: str,
    ) -> ChatMessageRead | None:
        # FR-CHAT-10, CON-PRIV-01: persist Read only for the recipient and only for this message.
        message = db.execute(
            select(ChatMessage).where(
                ChatMessage.id == message_id,
                ChatMessage.receiver_id == reader_id,
            )
        ).scalar_one_or_none()
        if message is None:
            return None
        if not message.is_read:
            try:
                message.is_read = True
                db.commit()
            except SQLAlchemyError:
                db.rollback()
                raise
        return message.to_read_model()

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
