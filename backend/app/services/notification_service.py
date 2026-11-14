from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Protocol

from app.models.roommate_request import RoommateRequest


class NotificationDeliveryError(RuntimeError):
    """Raised when the real notification system cannot deliver the request."""


@dataclass
class NotificationResult:
    success: bool
    message: str = ""
    attempts: int = 1
    request_id: Optional[str] = None


class NotificationService(Protocol):
    """Contract for team-owned notification delivery. Real implementations should be supplied by the owning feature later."""

    def send_request_notification(self, request: RoommateRequest) -> NotificationResult:
        ...


class InMemoryNotificationService:
    """Minimal in-memory contract used to validate the request flow without inventing a fake profile or match domain."""

    def __init__(self, *, fail: bool = False) -> None:
        self.fail = fail

    def send_request_notification(self, request: RoommateRequest) -> NotificationResult:
        if self.fail:
            raise NotificationDeliveryError("การแจ้งเตือนคำขอไม่สำเร็จ")

        return NotificationResult(
            success=True,
            message="sent",
            attempts=1,
            request_id=request.id,
        )


class NullNotificationService:
    """Default contract placeholder when no real notification runtime exists yet."""

    def send_request_notification(self, request: RoommateRequest) -> NotificationResult:
        return NotificationResult(
            success=True,
            message="notification not configured",
            attempts=0,
            request_id=request.id,
        )
