from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessageRead
from app.repositories.chat_repository import ChatRepository


class ProfileEligibilityChecker(Protocol):
    """Provider boundary for FR-CHAT-12, CON-CHAT-01 and CON-CHAT-03."""

    def can_start_chat(self, sender_id: str, recipient_id: str) -> tuple[bool, str | None]:
        ...

    def is_searchable(self, user_id: str) -> bool:
        """Return confirmed status or raise ProfileEligibilityUnavailable on provider failure."""
        ...


@dataclass(frozen=True)
class ChatStartResult:
    allowed: bool
    reason: str | None = None
    room_id: str | None = None
    read_only: bool = False


class MessagePersistenceError(Exception):
    """Signals a safe-to-report persistence failure for FR-CHAT-07 and CON-REL-01."""


class ProfileEligibilityUnavailable(Exception):
    """Signals that participant searchability could not be confirmed for CON-CHAT-03."""


class ConversationReadOnly(Exception):
    """Signals that at least one participant is not searchable under CON-CHAT-03."""


class ChatService:
    """Supports FR-CHAT-01/02/04/07/10/12/13/15 and CON-CHAT-01/03, CON-DATA-01, CON-REL-01."""

    def __init__(self, profile_checker: ProfileEligibilityChecker | None = None) -> None:
        self._profile_checker = profile_checker

    def send_message(
        self,
        db: Session,
        *,
        sender_id: str,
        receiver_id: str,
        content: str,
    ) -> ChatMessageRead:
        # FR-CHAT-04, CON-DATA-01, CON-REL-01: expose success only after repository commit.
        try:
            return ChatRepository.create_message(
                db,
                sender_id=sender_id,
                receiver_id=receiver_id,
                content=content,
            )
        except SQLAlchemyError as error:
            raise MessagePersistenceError from error

    def ensure_conversation_writable(self, sender_id: str, receiver_id: str) -> None:
        # CON-CHAT-03: require confirmed searchability for both members before any new message.
        provider = self._profile_checker
        if provider is None:
            raise ProfileEligibilityUnavailable("Searchability provider is not configured")

        is_searchable = getattr(provider, "is_searchable", None)
        if not callable(is_searchable):
            raise ProfileEligibilityUnavailable("Searchability check is not supported")

        searchability: list[bool] = []
        for participant_id in (sender_id, receiver_id):
            try:
                searchable = is_searchable(participant_id)
            except (ProfileEligibilityUnavailable, OSError) as error:
                raise ProfileEligibilityUnavailable from error

            if type(searchable) is not bool:
                raise ProfileEligibilityUnavailable("Searchability provider returned no boolean")
            searchability.append(searchable)

        if not all(searchability):
            raise ConversationReadOnly

    def mark_message_read(
        self,
        db: Session,
        *,
        message_id: int,
        reader_id: str,
    ) -> ChatMessageRead | None:
        # FR-CHAT-10, CON-PRIV-01: only the authenticated recipient can mark one message Read.
        return ChatRepository.mark_message_read(db, message_id=message_id, reader_id=reader_id)

    def can_start_chat(self, sender_id: str, recipient_id: str) -> ChatStartResult:
        if not sender_id or not recipient_id:
            return ChatStartResult(False, "sender_id and recipient_id are required")

        if sender_id == recipient_id:
            return ChatStartResult(False, "sender and recipient must be different users")

        if self._profile_checker is None:
            return ChatStartResult(
                False,
                "recipient profile eligibility is not connected; profile/search feature must provide this check",
            )

        allowed, reason = self._profile_checker.can_start_chat(sender_id, recipient_id)
        if not allowed:
            return ChatStartResult(False, reason or "recipient is not allowed to receive chat requests")

        return ChatStartResult(True, room_id=f"{sender_id}:{recipient_id}")

    def open_conversation(
        self,
        db: Session,
        sender_id: str,
        recipient_id: str,
    ) -> ChatStartResult:
        # FR-CHAT-12/15, CON-CHAT-03: preserve participant history while denying writes when eligibility is not confirmed.
        history_exists = (
            sender_id != recipient_id
            and ChatRepository.has_conversation(
                db,
                sender_id=sender_id,
                receiver_id=recipient_id,
            )
        )

        if history_exists:
            try:
                self.ensure_conversation_writable(sender_id, recipient_id)
            except (ConversationReadOnly, ProfileEligibilityUnavailable):
                return ChatStartResult(
                    True,
                    "Conversation is read-only",
                    f"{sender_id}:{recipient_id}",
                    read_only=True,
                )
            try:
                start_result = self.can_start_chat(sender_id, recipient_id)
            except (ProfileEligibilityUnavailable, OSError):
                return ChatStartResult(
                    True,
                    "Conversation is read-only because eligibility could not be confirmed",
                    f"{sender_id}:{recipient_id}",
                    read_only=True,
                )
            if not start_result.allowed:
                return ChatStartResult(
                    True,
                    start_result.reason,
                    f"{sender_id}:{recipient_id}",
                    read_only=True,
                )
            return start_result

        start_result = self.can_start_chat(sender_id, recipient_id)
        if not start_result.allowed:
            return start_result

        try:
            self.ensure_conversation_writable(sender_id, recipient_id)
        except ConversationReadOnly:
            return ChatStartResult(
                False,
                "A participant is not searchable",
            )
        except ProfileEligibilityUnavailable:
            return ChatStartResult(
                False,
                "Participant searchability could not be confirmed",
            )
        return start_result
