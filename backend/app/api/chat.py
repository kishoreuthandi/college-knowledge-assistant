import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.entities import ChatMessage, User
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chat_service import answer_question

router = APIRouter(tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    answer, confidence, sources, suggestions = answer_question(db, user, payload.question)
    return ChatResponse(answer=answer, confidence=confidence, sources=sources, suggestions=suggestions)


@router.get("/chat/history")
def chat_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(ChatMessage).filter(ChatMessage.user_id == user.id).order_by(ChatMessage.created_at.desc()).limit(50).all()
    return [
        {
            "id": row.id,
            "question": row.question,
            "answer": row.answer,
            "confidence": row.confidence,
            "sources": json.loads(row.sources_json),
            "created_at": row.created_at,
        }
        for row in rows
    ]


@router.get("/chat/history/download")
def download_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(ChatMessage).filter(ChatMessage.user_id == user.id).order_by(ChatMessage.created_at.asc()).all()
    content = "\n\n".join(f"Q: {row.question}\nA: {row.answer}" for row in rows)
    return StreamingResponse(
        iter([content]),
        media_type="text/plain",
        headers={"Content-Disposition": "attachment; filename=chat-history.txt"},
    )
