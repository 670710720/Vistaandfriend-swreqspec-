from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


class ProfileEligibilityChecker(Protocol):
    """Service boundary for feature-specific eligibility checks. Connect to the profile/search feature later."""

    def can_start_chat(self, sender_id: str, recipient_id: str) -> tuple[bool, str | None]:
        ...


@dataclass(frozen=True)
class ChatStartResult:
    allowed: bool
    reason: str | None = None
    room_id: str | None = None


class ChatService:
    """Supports FR-CHAT-01, FR-CHAT-02, FR-CHAT-12 and CON-CHAT-01."""

    def __init__(self, profile_checker: ProfileEligibilityChecker | None = None) -> None:
        self._profile_checker = profile_checker

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
