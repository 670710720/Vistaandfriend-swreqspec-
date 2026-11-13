from __future__ import annotations

from app.config import MAX_NOTIFICATION_RETRIES
from app.models.roommate_request import RoommateRequest
from app.services.notification_service import (
    NotificationDeliveryError,
    NotificationResult,
    NotificationService,
)


# รองรับ FR-RRS-16, AC-RRS-11A
class NotificationRetryService:
    def __init__(self, notification_service: NotificationService) -> None:
        self.notification_service = notification_service

    # รองรับ FR-RRS-16, AC-RRS-11A
    def send_request_notification(self, request: RoommateRequest) -> NotificationResult:
        attempts = 0
        last_message = ""
        last_request_id = request.id

        while attempts <= MAX_NOTIFICATION_RETRIES:
            attempts += 1
            try:
                result = self.notification_service.send_request_notification(request)
            except NotificationDeliveryError as exc:
                last_message = str(exc)
                continue

            last_request_id = result.request_id or request.id
            if result.success:
                return NotificationResult(
                    success=True,
                    message=result.message,
                    attempts=attempts,
                    request_id=last_request_id,
                )

            last_message = result.message or "การแจ้งเตือนคำขอไม่สำเร็จ"

        return NotificationResult(
            success=False,
            message=last_message,
            attempts=attempts,
            request_id=last_request_id,
        )
