from __future__ import annotations

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/chat")


class ChatStartRequest(BaseModel):
    sender_id: str = Field(..., min_length=1, max_length=100)
    recipient_id: str = Field(..., min_length=1, max_length=100)


class ChatStartResponse(BaseModel):
    allowed: bool
    reason: str | None = None
    room_id: str | None = None


def get_chat_service(request: Request) -> ChatService:
    return request.app.state.chat_service


@router.post("/open", response_model=ChatStartResponse)
def open_chat(payload: ChatStartRequest, request: Request) -> ChatStartResponse:
    """Open a conversation when the sender and recipient satisfy the chat eligibility rules."""
    chat_service = get_chat_service(request)
    result = chat_service.can_start_chat(payload.sender_id, payload.recipient_id)
    return ChatStartResponse(
        allowed=result.allowed,
        reason=result.reason,
        room_id=result.room_id,
    )
