from __future__ import annotations

import logging
import os
from collections.abc import AsyncIterator, Generator
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

from pydantic import ValidationError

from fastapi import Depends, FastAPI, File, Form, HTTPException, Query, Request, UploadFile
from sqlalchemy import create_engine, inspect
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker
from starlette.responses import FileResponse

from app.controllers.chat_controller import (
    get_authenticated_user_id,
    get_chat_service,
    router as chat_router,
)
from app.config import (
    CHAT_ALLOWED_ATTACHMENT_TYPES,
    CHAT_ATTACHMENT_MAX_SIZE_BYTES,
    CHAT_ATTACHMENT_RETENTION_DAYS,
    CHAT_MAX_ATTACHMENTS_PER_MESSAGE,
)
from app.models.chat_attachment import ChatAttachment
from app.models.chat_message import (
    Base,
    ChatMessage,
    ChatMessageCreate,
    ChatMessageRead,
    ChatMessageReadReceipt,
)
from app.repositories.chat_repository import ChatRepository
from app.services.chat_contact_provider import (
    ChatContactProvider,
    DevelopmentDemoProvider,
)
from app.services.attachment_storage import AttachmentStorage, AttachmentStorageError
from app.services.chat_service import (
    ChatService,
    ConversationReadOnly,
    MessagePersistenceError,
    ProfileEligibilityUnavailable,
    ProfileEligibilityChecker,
)

logger = logging.getLogger(__name__)

_ATTACHMENT_SIGNATURES = {
    "image/jpeg": b"\xff\xd8\xff",
    "image/png": b"\x89PNG\r\n\x1a\n",
    "application/pdf": b"%PDF-",
}


def _has_supported_attachment_signature(content_type: str, content: bytes) -> bool:
    """Validate file bytes for AC-CHAT-02A and AC-CHAT-02B."""
    signature = _ATTACHMENT_SIGNATURES.get(content_type)
    return signature is not None and content.startswith(signature)


def _ensure_chat_read_column(engine: Engine) -> None:
    # FR-CHAT-10: add the per-message Read field without rebuilding existing chat history.
    column_names = {
        column["name"] for column in inspect(engine).get_columns("chat_messages")
    }
    if "is_read" not in column_names:
        with engine.begin() as connection:
            connection.exec_driver_sql(
                "ALTER TABLE chat_messages ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT FALSE"
            )


def _ensure_chat_write_allowed(
    request: Request,
    chat_service: ChatService,
    sender_id: str,
    receiver_id: str,
) -> None:
    # CON-CHAT-03: fail closed for demos and whenever either member is not confirmed searchable.
    if request.app.state.chat_demo_mode:
        raise HTTPException(status_code=403, detail="Demo chat is read-only")
    try:
        chat_service.ensure_conversation_writable(sender_id, receiver_id)
    except ConversationReadOnly as error:
        raise HTTPException(
            status_code=403,
            detail="Conversation is read-only because a participant is not searchable",
        ) from error
    except ProfileEligibilityUnavailable as error:
        logger.exception("Could not confirm participant searchability before chat write")
        raise HTTPException(
            status_code=503,
            detail="ไม่สามารถยืนยันสถานะการค้นหาได้ กรุณาลองใหม่",
        ) from error


def create_app(
    database_url: str = "sqlite:///./chat.db",
    profile_checker: ProfileEligibilityChecker | None = None,
    contact_provider: ChatContactProvider | None = None,
    *,
    demo_mode: bool = False,
    runtime_environment: str = "production",
    attachment_storage: AttachmentStorage | None = None,
) -> FastAPI:
    """Create the chat app; demo identity and sample providers are development-only."""
    runtime_environment = runtime_environment.strip().lower()
    if demo_mode and runtime_environment != "development":
        raise RuntimeError("Chat demo mode can only run when APP_ENV=development")

    demo_provider = DevelopmentDemoProvider() if demo_mode else None
    active_profile_checker = demo_provider or profile_checker
    active_contact_provider = demo_provider or contact_provider

    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        # FR-CHAT-10: migrate older databases before serving Read-aware message responses.
        _ensure_chat_read_column(engine)
        yield

    app = FastAPI(
        title="Roommate chat backend",
        lifespan=lifespan,
    )
    app.state.session_factory = SessionLocal
    app.state.chat_service = ChatService(profile_checker=active_profile_checker)
    app.state.chat_contact_provider = active_contact_provider
    app.state.chat_demo_mode = demo_mode
    app.state.chat_attachment_storage = attachment_storage or AttachmentStorage()
    app.include_router(chat_router)

    if demo_provider is not None:
        @app.middleware("http")
        async def set_development_demo_identity(request, call_next):
            # CON-AUTH-01: demo principal is fixed by the server, never taken from sender_id.
            if request.url.path.startswith("/api/chat/"):
                request.state.user_id = demo_provider.current_user_id
            return await call_next(request)

    def get_db() -> Generator[Session, None, None]:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    @app.get("/health")
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/api/chat/messages", response_model=ChatMessageRead)
    def create_message(
        request: Request,
        payload: ChatMessageCreate,
        db: Session = Depends(get_db),
        authenticated_user_id: str = Depends(get_authenticated_user_id),
        chat_service: ChatService = Depends(get_chat_service),
    ) -> ChatMessageRead:
        # Supports FR-CHAT-04/07/13, CON-AUTH-01, CON-CHAT-03, CON-DATA-01 and CON-REL-01.
        if not payload.sender_id or not payload.receiver_id:
            raise HTTPException(status_code=400, detail="sender_id and receiver_id are required")
        if payload.sender_id != authenticated_user_id:
            raise HTTPException(status_code=403, detail="sender_id must match authenticated user")
        _ensure_chat_write_allowed(
            request,
            chat_service,
            payload.sender_id,
            payload.receiver_id,
        )
        try:
            return chat_service.send_message(
                db,
                sender_id=payload.sender_id,
                receiver_id=payload.receiver_id,
                content=payload.content,
            )
        except MessagePersistenceError as error:
            logger.exception("Failed to persist chat message")
            raise HTTPException(
                status_code=503,
                detail="ไม่สามารถบันทึกข้อความได้ กรุณาลองใหม่",
            ) from error

    @app.post("/api/chat/messages/with-attachment")
    async def create_message_with_attachment(
        request: Request,
        sender_id: str = Form(...),
        receiver_id: str = Form(...),
        content: str = Form(...),
        attachments: list[UploadFile] | None = File(default=None),
        db: Session = Depends(get_db),
        authenticated_user_id: str = Depends(get_authenticated_user_id),
    ) -> dict[str, object]:
        # Supports FR-CHAT-09/11, CON-CHAT-02/03, CON-DATA-01 and CON-REL-01.
        if sender_id != authenticated_user_id:
            raise HTTPException(status_code=403, detail="sender_id must match authenticated user")
        if not attachments:
            raise HTTPException(status_code=422, detail="One attachment is required")
        if len(attachments) > CHAT_MAX_ATTACHMENTS_PER_MESSAGE:
            raise HTTPException(
                status_code=422,
                detail="A message can contain only one attachment",
            )

        try:
            payload = ChatMessageCreate(
                sender_id=sender_id,
                receiver_id=receiver_id,
                content=content,
            )
        except ValidationError as error:
            raise HTTPException(status_code=422, detail="Invalid chat message") from error

        uploaded_file = attachments[0]
        original_filename = (uploaded_file.filename or "").replace("\\", "/").rsplit("/", 1)[-1]
        expected_content_type = CHAT_ALLOWED_ATTACHMENT_TYPES.get(
            Path(original_filename).suffix.lower()
        )
        if not original_filename or expected_content_type is None:
            raise HTTPException(
                status_code=415,
                detail="Only JPG, PNG, and PDF attachments are supported",
            )
        if uploaded_file.content_type != expected_content_type:
            raise HTTPException(
                status_code=415,
                detail="Attachment content type does not match its file type",
            )

        file_content = await uploaded_file.read(CHAT_ATTACHMENT_MAX_SIZE_BYTES + 1)
        if len(file_content) > CHAT_ATTACHMENT_MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail="Attachment exceeds the maximum supported size",
            )
        if not _has_supported_attachment_signature(expected_content_type, file_content):
            raise HTTPException(
                status_code=415,
                detail="Attachment content does not match its file type",
            )

        chat_service: ChatService = request.app.state.chat_service
        _ensure_chat_write_allowed(request, chat_service, sender_id, receiver_id)

        storage: AttachmentStorage = request.app.state.chat_attachment_storage
        try:
            storage_key = storage.save(file_content)
        except AttachmentStorageError as error:
            logger.exception("Failed to store chat attachment")
            raise HTTPException(
                status_code=503,
                detail="ไม่สามารถบันทึกไฟล์แนบได้ กรุณาลองใหม่",
            ) from error

        try:
            message, attachment = ChatRepository.create_message_with_attachment(
                db,
                sender_id=payload.sender_id,
                receiver_id=payload.receiver_id,
                content=payload.content,
                original_filename=original_filename,
                content_type=expected_content_type,
                size_bytes=len(file_content),
                storage_key=storage_key,
                retention_days=CHAT_ATTACHMENT_RETENTION_DAYS,
            )
        except SQLAlchemyError as error:
            try:
                storage.delete(storage_key)
            except AttachmentStorageError:
                logger.exception("Failed to remove unattached chat file after persistence failure")
            logger.exception("Failed to persist chat message and attachment metadata")
            raise HTTPException(
                status_code=503,
                detail="ไม่สามารถบันทึกข้อความและไฟล์แนบได้ กรุณาลองใหม่",
            ) from error

        response = message.model_dump(mode="json")
        response["attachment"] = {
            "id": attachment.id,
            "name": attachment.original_filename,
            "content_type": attachment.content_type,
            "size_bytes": attachment.size_bytes,
            "download_url": f"/api/chat/attachments/{attachment.id}",
        }
        return response

    @app.post(
        "/api/chat/messages/{message_id}/read",
        response_model=ChatMessageReadReceipt,
    )
    def mark_message_read(
        message_id: int,
        db: Session = Depends(get_db),
        authenticated_user_id: str = Depends(get_authenticated_user_id),
        chat_service: ChatService = Depends(get_chat_service),
    ) -> ChatMessageReadReceipt:
        # FR-CHAT-10, CON-PRIV-01: persist Read only for the recipient of the selected message.
        read_message = chat_service.mark_message_read(
            db,
            message_id=message_id,
            reader_id=authenticated_user_id,
        )
        if read_message is None:
            raise HTTPException(status_code=404, detail="Message not found")
        return ChatMessageReadReceipt(id=read_message.id, is_read=read_message.is_read)

    @app.get("/api/chat/messages")
    def list_messages(
        request: Request,
        sender_id: str = Query(..., min_length=1),
        receiver_id: str = Query(..., min_length=1),
        db: Session = Depends(get_db),
        authenticated_user_id: str = Depends(get_authenticated_user_id),
    ) -> list[dict[str, object | None]]:
        # Supports FR-CHAT-02/08/10, CON-AUTH-01 and CON-PRIV-01.
        if authenticated_user_id not in {sender_id, receiver_id}:
            raise HTTPException(
                status_code=403,
                detail="Only conversation participants can access this history",
            )
        messages = ChatRepository.list_messages(
            db,
            sender_id=sender_id,
            receiver_id=receiver_id,
        )
        attachments_by_message_id = {
            attachment.message_id: attachment
            for attachment in ChatRepository.list_attachments(
                db,
                message_ids=[message.id for message in messages],
            )
        }
        now = datetime.now(timezone.utc)
        history: list[dict[str, object | None]] = []
        for message in messages:
            item: dict[str, object | None] = message.to_read_model().model_dump(mode="json")
            attachment = attachments_by_message_id.get(message.id)
            if attachment is None:
                item["attachment"] = None
            else:
                expires_at = attachment.expires_at
                if expires_at.tzinfo is None:
                    expires_at = expires_at.replace(tzinfo=timezone.utc)
                if now > expires_at:
                    item["attachment"] = None
                else:
                    item["attachment"] = {
                        "id": attachment.id,
                        "name": attachment.original_filename,
                        "content_type": attachment.content_type,
                        "size_bytes": attachment.size_bytes,
                        "download_url": f"/api/chat/attachments/{attachment.id}",
                    }
            history.append(item)
        return history

    @app.get("/api/chat/attachments/{attachment_id}")
    def download_attachment(
        request: Request,
        attachment_id: int,
        db: Session = Depends(get_db),
        authenticated_user_id: str = Depends(get_authenticated_user_id),
    ) -> FileResponse:
        # Supports FR-CHAT-16, CON-CHAT-04, CON-PRIV-01 and NFR-SEC-02.
        attachment = ChatRepository.get_attachment(db, attachment_id)
        if attachment is None:
            raise HTTPException(status_code=404, detail="Attachment not found")

        message = db.get(ChatMessage, attachment.message_id)
        if message is None:
            raise HTTPException(status_code=404, detail="Attachment not found")
        if authenticated_user_id not in {message.sender_id, message.receiver_id}:
            raise HTTPException(status_code=403, detail="Only conversation participants can access attachments")

        expires_at = attachment.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expires_at:
            raise HTTPException(status_code=410, detail="Attachment is no longer available")

        storage: AttachmentStorage = request.app.state.chat_attachment_storage
        try:
            file_path = storage.path_for(attachment.storage_key)
        except AttachmentStorageError as error:
            logger.exception("Invalid chat attachment storage key")
            raise HTTPException(status_code=500, detail="Attachment is unavailable") from error
        if not file_path.is_file():
            raise HTTPException(status_code=404, detail="Attachment not found")
        return FileResponse(
            file_path,
            media_type=attachment.content_type,
            filename=attachment.original_filename,
        )

    return app


runtime_environment = os.getenv("APP_ENV", "production").strip().lower()
demo_mode = os.getenv("CHAT_DEMO_MODE", "").strip().lower() == "true"
app = create_app(demo_mode=demo_mode, runtime_environment=runtime_environment)
