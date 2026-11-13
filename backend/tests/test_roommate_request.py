import pytest

from app.models.roommate_request import RoommateRequest
from app.services.request_roommate_service import RequestRoommateService


def test_AC_RRS_01():
    service = RequestRoommateService()

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
    service = RequestRoommateService()
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


def test_AC_RRS_06A():
    service = RequestRoommateService()
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


def test_AC_RRS_04B():
    service = RequestRoommateService()
    long_message = "a" * 501

    with pytest.raises(ValueError, match="500"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message=long_message,
            receiver_status="looking_for_roommate",
        )

def test_missing_receiver_status_is_rejected():
    service = RequestRoommateService()

    with pytest.raises(ValueError, match="ผู้รับต้องอยู่ในสถานะหาเมท"):
        service.create_request(
            sender_id="student-a",
            receiver_id="student-b",
            message="hello",
        )

    assert service.requests == []
