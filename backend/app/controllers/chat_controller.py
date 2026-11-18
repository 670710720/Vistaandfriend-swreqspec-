from __future__ import annotations

import logging
from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.services.chat_contact_provider import ChatContactProvider
from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/chat")
logger = logging.getLogger(__name__)


class ChatStartRequest(BaseModel):
    sender_id: str = Field(..., min_length=1, max_length=100)
    recipient_id: str = Field(..., min_length=1, max_length=100)


class ChatStartResponse(BaseModel):
    allowed: bool
    read_only: bool
    reason: str | None = None
    room_id: str | None = None


class ChatContactRead(BaseModel):
    id: str
    name: str


class ChatListResponse(BaseModel):
    current_user_id: str
    demo_mode: bool
    contacts: list[ChatContactRead]


def get_authenticated_user_id(request: Request) -> str:
    # CON-AUTH-01: consume identity supplied by trusted upstream middleware; do not implement authentication here.
    user_id = getattr(request.state, "user_id", None)
    if not isinstance(user_id, str) or not user_id.strip():
        raise HTTPException(status_code=401, detail="Authentication context is missing")
    return user_id


def get_chat_service(request: Request) -> ChatService:
    return request.app.state.chat_service


def get_chat_db(request: Request) -> Generator[Session, None, None]:
    # FR-CHAT-15: scope persisted-history checks to the app's configured database session.
    db = request.app.state.session_factory()
    try:
        yield db
    finally:
        db.close()


def get_chat_contact_provider(request: Request) -> ChatContactProvider:
    # FR-CHAT-01: use an injected provider; never substitute sample contacts in production.
    provider = request.app.state.chat_contact_provider
    if provider is None:
        raise HTTPException(status_code=503, detail="Student contact provider is not configured")
    return provider


@router.get("/list", response_model=ChatListResponse)
def list_chat_contacts(
    request: Request,
    authenticated_user_id: str = Depends(get_authenticated_user_id),
    contact_provider: ChatContactProvider = Depends(get_chat_contact_provider),
) -> ChatListResponse:
    """Support FR-CHAT-01 using the configured contact provider."""
    contacts = contact_provider.list_contacts(authenticated_user_id)
    return ChatListResponse(
        current_user_id=authenticated_user_id,
        demo_mode=request.app.state.chat_demo_mode,
        contacts=[ChatContactRead(id=contact.id, name=contact.name) for contact in contacts],
    )


@router.post("/open", response_model=ChatStartResponse)
def open_chat(
    payload: ChatStartRequest,
    request: Request,
    db: Session = Depends(get_chat_db),
    authenticated_user_id: str = Depends(get_authenticated_user_id),
) -> ChatStartResponse:
    """Support FR-CHAT-01, FR-CHAT-02, FR-CHAT-12, CON-AUTH-01 and CON-CHAT-01."""
    if payload.sender_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="sender_id must match authenticated user")

    chat_service = get_chat_service(request)
    try:
        result = chat_service.open_conversation(
            db,
            payload.sender_id,
            payload.recipient_id,
        )
    except SQLAlchemyError as error:
        logger.exception("Could not check existing chat history before opening")
        raise HTTPException(
            status_code=503,
            detail="ไม่สามารถตรวจสอบประวัติแชทได้ กรุณาลองใหม่",
        ) from error
    return ChatStartResponse(
        allowed=result.allowed,
        read_only=result.read_only or (result.allowed and request.app.state.chat_demo_mode),
        reason=result.reason,
        room_id=result.room_id,
    )
