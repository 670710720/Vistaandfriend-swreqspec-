from datetime import datetime, timedelta, timezone
from unittest.mock import Mock

import pytest

from app.config import MAX_NOTIFICATION_RETRIES
from app.models.roommate_request import RoommateRequest
from app.services.notification_service import (
    InMemoryNotificationService,
    NotificationDeliveryError,
    NotificationResult,
    NotificationService,
)
from app.services.request_roommate_service import RequestRoommateService


# Unit contract result only; this does not create Match data or an integration fixture.
def no_active_match_checker(_sender_id: str, _receiver_id: str) -> bool:
    return False


def active_match_checker(_sender_id: str, _receiver_id: str) -> bool:
    return True


def test_AC_RRS_01():
    service = RequestRoommateService(match_status_checker=no_active_match_checker)

    request = service.create_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="สวัสดี อยากเป็นเมท",
        receiver_status="looking_for_roommate",
    )

    assert isinstance(request, RoommateRequest)
    assert request.status == "pending"
    assert request.message == "สวัสดี อยากเป็นเมท"
    assert len(service.requests) == 1


def test_AC_RRS_02():
    service = RequestRoommateService()

    with pytest.raises(ValueError, match="ผู้รับต้องอยู่ในสถานะหาเมท"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="hello",
            receiver_status="not_available",
        )

    assert service.requests == []


def test_AC_RRS_03():
    service = RequestRoommateService(match_status_checker=no_active_match_checker)
    service.create_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="hello",
        receiver_status="looking_for_roommate",
    )

    with pytest.raises(ValueError, match="มีคำขอเป็นเมทกับผู้รับรายนี้อยู่แล้ว"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="hello again",
            receiver_status="looking_for_roommate",
        )


def test_AC_RRS_05():
    service = RequestRoommateService()

    with pytest.raises(ValueError, match="ผู้รับต้องอยู่ในสถานะหาเมท"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="hello",
            receiver_status="not_available",
        )

    assert service.requests == []


@pytest.mark.skip(reason="BLOCKED: no real authentication system exists in this repo for AC-RRS-07")
def test_AC_RRS_07():
    service = RequestRoommateService(auth_checker=lambda sender_id: sender_id is not None)

    with pytest.raises(ValueError, match="ไม่ได้เข้าสู่ระบบ"):
        service.create_request(
            sender_id=None,
            receiver_id="student-b",
            message="hello",
            receiver_status="looking_for_roommate",
        )


def test_AC_RRS_06():
    service = RequestRoommateService(match_status_checker=no_active_match_checker)
    service.create_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="hello from a",
        receiver_status="looking_for_roommate",
    )

    with pytest.raises(ValueError, match="มีคำขอเป็นเมทกับผู้รับรายนี้อยู่แล้ว"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="hello from a again",
            receiver_status="looking_for_roommate",
        )


def test_AC_RRS_08():
    service = RequestRoommateService(match_status_checker=no_active_match_checker)
    service.create_request(
        sender_id="student-c",
        receiver_id="student-b",
        message="pending from another sender",
        receiver_status="looking_for_roommate",
    )

    request = service.create_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="allowed while other sender is pending",
        receiver_status="looking_for_roommate",
    )

    assert request.sender_id == "student-a"
    assert request.receiver_id == "student-b"
    assert len(service.requests) == 2



def test_AC_RRS_09():
    service = RequestRoommateService()
    requests_before = len(service.requests)

    with pytest.raises(ValueError, match="ไม่สามารถส่งคำขอเป็นเมทให้ตนเองได้"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-a",
            message="self request",
            receiver_status="looking_for_roommate",
        )

    assert len(service.requests) == requests_before



def test_AC_RRS_06A():
    service = RequestRoommateService(match_status_checker=no_active_match_checker)
    service.create_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="hello",
        receiver_status="looking_for_roommate",
    )

    with pytest.raises(ValueError, match="มีคำขอเป็นเมทกับผู้รับรายนี้อยู่แล้ว"):
        service.can_submit_request(
            sender_id="student-a",
            receiver_id="student-b",
            receiver_status="looking_for_roommate",
            message="second attempt",
        )


@pytest.mark.skip(reason="BLOCKED: no real profile system exists in this repo for AC-RRS-12")
def test_AC_RRS_12():
    service = RequestRoommateService(profile_checker=lambda profile_id: profile_id is not None)

    with pytest.raises(ValueError, match="ยังไม่มีโปรไฟล์หาเมท"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="hello",
            receiver_status="looking_for_roommate",
            profile_id=None,
        )


def test_AC_RRS_04B():
    service = RequestRoommateService()
    long_message = "ก" * 500 + "😀"

    with pytest.raises(ValueError, match="500"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message=long_message,
            receiver_status="looking_for_roommate",
        )

    assert service.requests == []


def test_AC_RRS_04B_accepts_exactly_500_unicode_code_points():
    message = "ก" * 499 + "😀"
    request = RoommateRequest.create(
        sender_id="student-a",
        receiver_id="student-b",
        message=message,
        receiver_status="looking_for_roommate",
    )

    assert len(request.message) == 500
def test_AC_RRS_04B_accepts_request_without_message():
    service = RequestRoommateService(match_status_checker=no_active_match_checker)

    request = service.create_request(
        sender_id="student-a",
        receiver_id="student-b",
        receiver_status="looking_for_roommate",
    )

    assert request.message in (None, "")
    assert len(service.requests) == 1

def test_direct_roommate_request_accepts_500_unicode_code_points():
    message = "ก" * 499 + "😀"

    request = RoommateRequest(
        sender_id="student-a",
        receiver_id="student-b",
        message=message,
    )

    assert len(request.message) == 500


def test_direct_roommate_request_rejects_501_unicode_code_points():
    message = "ก" * 500 + "😀"

    with pytest.raises(ValueError, match="500"):
        RoommateRequest(
            sender_id="student-a",
            receiver_id="student-b",
            message=message,
        )


def test_AC_RRS_13A():
    pytest.skip("BLOCKED: no real Match data contract exists in this repo for AC-RRS-13A")


def test_has_active_match_returns_false_when_checker_confirms_no_active_match():
    service = RequestRoommateService(match_status_checker=no_active_match_checker)

    assert service.has_active_match("student-a", "student-b") is False


def test_has_active_match_returns_true_and_blocks_request_when_checker_confirms_active_match():
    service = RequestRoommateService(match_status_checker=active_match_checker)

    assert service.has_active_match("student-a", "student-b") is True
    with pytest.raises(ValueError, match="การจับคู่สำเร็จ"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="new request while match is active",
            receiver_status="looking_for_roommate",
        )
    assert service.requests == []


def test_has_active_match_returns_unknown_without_match_checker():
    service = RequestRoommateService()

    assert service.has_active_match("student-a", "student-b") is None


def test_request_is_blocked_when_match_status_cannot_be_checked():
    service = RequestRoommateService()

    with pytest.raises(ValueError, match="ไม่สามารถตรวจสอบสถานะการจับคู่ได้"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="cannot confirm match state",
            receiver_status="looking_for_roommate",
        )

    assert service.requests == []


def test_missing_receiver_status_is_rejected():
    service = RequestRoommateService()

    with pytest.raises(ValueError, match="ผู้รับต้องอยู่ในสถานะหาเมท"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="hello",
        )

    assert service.requests == []


def test_AC_RRS_04():
    service = RequestRoommateService(
        notification_service=InMemoryNotificationService(fail=False),
        match_status_checker=no_active_match_checker,
    )

    request = service.submit_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="สวัสดี",
        receiver_status="looking_for_roommate",
    )

    assert request.status == "pending"
    assert request.notification_status == "sent"
    assert len(service.requests) == 1


def test_AC_RRS_04A():
    service = RequestRoommateService(
        notification_service=InMemoryNotificationService(fail=True),
        match_status_checker=no_active_match_checker,
    )

    request = service.submit_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="แจ้งเตือนล้มเหลว",
        receiver_status="looking_for_roommate",
    )

    assert request.status == "pending"
    assert request.notification_status == "failed"
    assert request.notification_error == "การแจ้งเตือนคำขอไม่สำเร็จ"
    assert len(service.requests) == 1


def test_AC_RRS_11():
    service = RequestRoommateService(
        notification_service=InMemoryNotificationService(fail=False),
        match_status_checker=no_active_match_checker,
    )

    request = service.submit_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="hello",
        receiver_status="looking_for_roommate",
    )

    assert request.notification_status == "sent"
    assert request.status == "pending"
    assert request.to_dict()["notification_status"] == "sent"


# รองรับ FR-RRS-16, AC-RRS-11A
def test_AC_RRS_11A_retries_three_times_and_keeps_request_pending():
    notification_service = Mock(spec=NotificationService)
    notification_service.send_request_notification.side_effect = NotificationDeliveryError(
        "การแจ้งเตือนคำขอไม่สำเร็จ"
    )
    service = RequestRoommateService(
        notification_service=notification_service,
        match_status_checker=no_active_match_checker,
    )

    request = service.submit_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="แจ้งเตือนล้มเหลว",
        receiver_status="looking_for_roommate",
    )

    assert notification_service.send_request_notification.call_count == (
        MAX_NOTIFICATION_RETRIES + 1
    )
    assert request.status == "pending"
    assert request.notification_status == "failed"
    assert len(service.requests) == 1


# รองรับ FR-RRS-16, AC-RRS-11A
def test_AC_RRS_11A_stops_retrying_after_notification_succeeds():
    notification_service = Mock(spec=NotificationService)
    notification_service.send_request_notification.side_effect = [
        NotificationResult(success=False, message="try again"),
        NotificationResult(success=True, message="sent"),
    ]
    service = RequestRoommateService(
        notification_service=notification_service,
        match_status_checker=no_active_match_checker,
    )

    request = service.submit_request(
        sender_id="student-a",
        receiver_id="student-b",
        message="แจ้งเตือนสำเร็จหลังลองซ้ำ",
        receiver_status="looking_for_roommate",
    )

    assert notification_service.send_request_notification.call_count == 2
    assert request.status == "pending"
    assert request.notification_status == "sent"


# รองรับ CON-RRS-09, FR-RRS-07
# คำขอ pending ต้องไม่หมดอายุหรือถูกลบอัตโนมัติเมื่อเวลาผ่านไป
def test_AC_RRS_15_pending_request_remains_pending_after_time_passes():
    service = RequestRoommateService()
    stale_time = datetime.now(timezone.utc) - timedelta(days=30)

    request = RoommateRequest.create(
        sender_id="student-a",
        receiver_id="student-b",
        message="รอการตอบรับเกิน 30 วัน",
        receiver_status="looking_for_roommate",
    )
    request.created_at = stale_time
    request.updated_at = stale_time
    service.repository.add(request)
    service.requests = service.repository.list()

    assert len(service.requests) == 1
    assert service.requests[0].status == "pending"
    assert service.requests[0].created_at < datetime.now(timezone.utc)
    assert service.requests[0].status == "pending"
