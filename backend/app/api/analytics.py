import json
from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.database.session import get_db
from app.models.entities import ChatMessage, Document, DocumentChunk, User
from app.models.schemas import AnalyticsResponse

router = APIRouter(tags=["Analytics"])


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    documents = db.query(Document).all()
    module_counts = Counter(document.module for document in documents)
    recent = db.query(ChatMessage).order_by(ChatMessage.created_at.desc()).limit(10).all()
    return AnalyticsResponse(
        total_documents=len(documents),
        total_chunks=db.query(DocumentChunk).count(),
        total_users=db.query(User).count(),
        total_queries=db.query(ChatMessage).count(),
        top_modules=[{"module": module, "count": count} for module, count in module_counts.most_common(8)],
        recent_queries=[
            {
                "question": row.question,
                "confidence": row.confidence,
                "sources": json.loads(row.sources_json),
                "created_at": row.created_at.isoformat(),
            }
            for row in recent
        ],
    )
