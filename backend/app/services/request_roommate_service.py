
from __future__ import annotations

from typing import Iterable, List, Optional

from app.models.roommate_request import RoommateRequest, normalize_receiver_status

# รองรับ CON-RRS-03, CON-RRS-04, CON-RRS-05, CON-RRS-06,
# FR-RRS-03, FR-RRS-04, FR-RRS-05, FR-RRS-14

class RequestRoommateService:
    """Stores and validates roommate requests before they are saved."""

    def __init__(self, requests: Optional[Iterable[RoommateRequest]] = None) -> None:
        self.requests: List[RoommateRequest] = list(requests or [])

    @staticmethod
    def validate_message_length(message: Optional[str]) -> None:
        RoommateRequest.validate_message_length(message)

    @staticmethod
    def is_receiver_available(receiver_status: Optional[str]) -> bool:
        normalized = normalize_receiver_status(receiver_status)
        return normalized == "looking_for_roommate"

    def has_pending_request(self, sender_id: str, receiver_id: str) -> bool:
        for request in self.requests:
            if (
                request.sender_id == sender_id
                and request.receiver_id == receiver_id
                and request.status == "pending"
            ):
                return True
        return False

    def can_submit_request(
        self,
        sender_id: str,
        receiver_id: str,
        receiver_status: Optional[str],
        message: Optional[str] = None,
    ) -> bool:
        self.validate_message_length(message)

        if sender_id == receiver_id:
            raise ValueError("ไม่สามารถส่งคำขอเป็นเมทให้ตนเองได้")

        if not self.is_receiver_available(receiver_status):
            raise ValueError("ผู้รับต้องอยู่ในสถานะหาเมทก่อนส่งคำขอ")

        if self.has_pending_request(sender_id, receiver_id):
            raise ValueError(
                "มีคำขอเป็นเมทกับผู้รับรายนี้อยู่แล้ว และยังอยู่ระหว่างรอการตอบรับ"
            )

        return True

    def create_request(
        self,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        receiver_status: Optional[str] = None,
    ) -> RoommateRequest:
        self.can_submit_request(sender_id, receiver_id, receiver_status, message)

        request = RoommateRequest.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=message,
            receiver_status=receiver_status,
        )

        self.requests.append(request)
        return request

    def submit_request(
        self,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        receiver_status: Optional[str] = None,
    ) -> RoommateRequest:
        return self.create_request(sender_id, receiver_id, message, receiver_status)

    def request_roommate(
        self,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        receiver_status: Optional[str] = None,
    ) -> RoommateRequest:
        return self.create_request(sender_id, receiver_id, message, receiver_status)

    def get_requests_for_student(self, student_id: str) -> List[RoommateRequest]:
        return [
            request
            for request in self.requests
            if request.sender_id == student_id or request.receiver_id == student_id
        ]
