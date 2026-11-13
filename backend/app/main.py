from __future__ import annotations

from collections.abc import Generator

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.controllers.chat_controller import router as chat_router
from app.models.chat_message import Base, ChatMessageCreate, ChatMessageRead
from app.repositories.chat_repository import ChatRepository
from app.services.chat_service import ChatService, ProfileEligibilityChecker


def create_app(
    database_url: str = "sqlite:///./chat.db",
    profile_checker: ProfileEligibilityChecker | None = None,
) -> FastAPI:
    """Create the FastAPI app and initialize the chat schema for T-01."""
    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="Roommate chat backend")
    app.state.chat_service = ChatService(profile_checker=profile_checker)
    app.include_router(chat_router)

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
    def create_message(payload: ChatMessageCreate, db: Session = Depends(get_db)) -> ChatMessageRead:
        # Supports CON-DATA-01 and FR-CHAT-04 by creating a persisted message record.
        if not payload.sender_id or not payload.receiver_id:
            raise HTTPException(status_code=400, detail="sender_id and receiver_id are required")
        message = ChatRepository.create_message(
            db,
            sender_id=payload.sender_id,
            receiver_id=payload.receiver_id,
            content=payload.content,
        )
        return message.to_read_model()

    @app.get("/api/chat/messages", response_model=list[ChatMessageRead])
    def list_messages(
        sender_id: str | None = Query(default=None),
        receiver_id: str | None = Query(default=None),
        db: Session = Depends(get_db),
    ) -> list[ChatMessageRead]:
        # Supports FR-CHAT-02 and CON-PRIV-01 by retrieving a participant-scoped history.
        messages = ChatRepository.list_messages(
            db,
            sender_id=sender_id,
            receiver_id=receiver_id,
        )
        return [message.to_read_model() for message in messages]

    return app


app = create_app()
