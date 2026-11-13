
from __future__ import annotations

from typing import Callable, Iterable, List, Optional

from app.models.roommate_request import RoommateRequest, normalize_receiver_status
from app.repositories.roommate_request_repository import InMemoryRoommateRequestRepository
from app.services.notification_service import (
    InMemoryNotificationService,
    NotificationDeliveryError,
    NotificationResult,
    NotificationService,
    NullNotificationService,
)
from app.services.notification_retry_service import NotificationRetryService
from app.validators.request_guard import RequestGuard

# รองรับ CON-RRS-03, CON-RRS-04, CON-RRS-05, CON-RRS-06,
# CON-RRS-07, CON-RRS-12, FR-RRS-03, FR-RRS-04, FR-RRS-05, FR-RRS-08,
# FR-RRS-09, FR-RRS-14, FR-RRS-16, NFR-RRS-02, NFR-RRS-04


class RequestRoommateService:
    """Stores and validates roommate requests before they are saved."""

    def __init__(
        self,
        requests: Optional[Iterable[RoommateRequest]] = None,
        repository: Optional[InMemoryRoommateRequestRepository] = None,
        match_status_checker: Optional[Callable[[str, str], bool]] = None,
        auth_checker: Optional[Callable[[Optional[str]], bool]] = None,
        profile_checker: Optional[Callable[[Optional[str]], bool]] = None,
        notification_service: Optional[NotificationService] = None,
    ) -> None:
        self.repository = repository or InMemoryRoommateRequestRepository(requests)
        self.requests: List[RoommateRequest] = self.repository.list()
        self.match_status_checker = match_status_checker
        self.auth_checker = auth_checker
        self.profile_checker = profile_checker
        notification_service = notification_service or NullNotificationService()
        self.notification_service = NotificationRetryService(notification_service)

    @staticmethod
    def validate_message_length(message: Optional[str]) -> None:
        RoommateRequest.validate_message_length(message)

    @staticmethod
    def is_receiver_available(receiver_status: Optional[str]) -> bool:
        normalized = normalize_receiver_status(receiver_status)
        return normalized == "looking_for_roommate"

    def has_pending_request(self, sender_id: str, receiver_id: str) -> bool:
        # รองรับ FR-RRS-04, CON-RRS-05, CON-RRS-06
        return bool(
            self.repository.find_pending_by_sender_receiver(sender_id, receiver_id)
        )

    def has_pending_requests_for_receiver(self, receiver_id: str) -> bool:
        # รองรับ CON-RRS-07; ผู้รับสามารถมีคำขอ pending จากผู้ส่งหลายคนพร้อมกันได้
        return bool(self.repository.find_pending_by_receiver(receiver_id))

    def has_active_match(self, sender_id: str, receiver_id: str) -> Optional[bool]:
        # รองรับ CON-RRS-12; None หมายถึงไม่มี Match contract ให้ตรวจสอบ
        if self.match_status_checker is None:
            return None
        return bool(self.match_status_checker(sender_id, receiver_id))

    def can_submit_request(
        self,
        sender_id: str,
        receiver_id: str,
        receiver_status: Optional[str],
        message: Optional[str] = None,
        profile_id: Optional[str] = None,
    ) -> bool:
        # รองรับ FR-RRS-03, FR-RRS-08, FR-RRS-09, CON-RRS-03, CON-RRS-04,
        # CON-RRS-01, CON-RRS-02, NFR-RRS-01
        self.validate_message_length(message)

        if self.auth_checker is not None:
            RequestGuard.ensure_authenticated(sender_id, self.auth_checker)
        elif sender_id is None or str(sender_id).strip() == "":
            raise ValueError("นักศึกษาไม่ได้เข้าสู่ระบบ")

        if self.profile_checker is not None:
            RequestGuard.ensure_profile_exists(profile_id, self.profile_checker)

        RequestGuard.ensure_not_self_request(sender_id, receiver_id)

        if not self.is_receiver_available(receiver_status):
            raise ValueError("ผู้รับต้องอยู่ในสถานะหาเมทก่อนส่งคำขอ")

        if self.has_pending_request(sender_id, receiver_id):
            raise ValueError(
                "มีคำขอเป็นเมทกับผู้รับรายนี้อยู่แล้ว และยังอยู่ระหว่างรอการตอบรับ"
            )

        active_match = self.has_active_match(sender_id, receiver_id)
        if active_match is None:
            raise ValueError(
                "ไม่สามารถตรวจสอบสถานะการจับคู่ได้ เนื่องจากไม่มี Match data contract"
            )

        if active_match:
            raise ValueError(
                "มีการจับคู่สำเร็จระหว่างผู้ส่งกับผู้รับอยู่แล้ว ต้องยกเลิกการจับคู่เดิมก่อน"
            )

        return True

    def create_request(
        self,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        receiver_status: Optional[str] = None,
        profile_id: Optional[str] = None,
    ) -> RoommateRequest:
        # รองรับ FR-RRS-05, FR-RRS-07, FR-RRS-14, CON-RRS-10
        self.can_submit_request(
            sender_id,
            receiver_id,
            receiver_status,
            message,
            profile_id=profile_id,
        )

        request = RoommateRequest.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=message,
            receiver_status=receiver_status,
        )
        request.notification_status = "pending"

        self.repository.add(request)
        self.requests = self.repository.list()
        return request

    def notify_recipient(self, request: RoommateRequest) -> NotificationResult:
        """Sends the request notification without mutating the saved request status when it fails."""
        try:
            result = self.notification_service.send_request_notification(request)
        except NotificationDeliveryError as exc:
            request.notification_status = "failed"
            request.notification_error = str(exc)
            return NotificationResult(
                success=False,
                message=str(exc),
                attempts=0,
                request_id=request.id,
            )

        if result.success:
            request.notification_status = "sent"
            request.notification_error = None
        else:
            request.notification_status = "failed"
            request.notification_error = result.message or "การแจ้งเตือนคำขอไม่สำเร็จ"
        return result

    def submit_request(
        self,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        receiver_status: Optional[str] = None,
        profile_id: Optional[str] = None,
    ) -> RoommateRequest:
        # FR-RRS-05, FR-RRS-06, FR-RRS-07, FR-RRS-13
        request = self.create_request(
            sender_id,
            receiver_id,
            message,
            receiver_status,
            profile_id=profile_id,
        )

        self.notify_recipient(request)
        return request

    def request_roommate(
        self,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        receiver_status: Optional[str] = None,
        profile_id: Optional[str] = None,
    ) -> RoommateRequest:
        return self.submit_request(
            sender_id,
            receiver_id,
            message,
            receiver_status,
            profile_id=profile_id,
        )

    def get_requests_for_student(self, student_id: str) -> List[RoommateRequest]:
        return [
            request
            for request in self.requests
            if request.sender_id == student_id or request.receiver_id == student_id
        ]
