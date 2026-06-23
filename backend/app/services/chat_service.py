import json

from sqlalchemy.orm import Session

from app.models.entities import ChatMessage, Document, User
from app.models.schemas import Source
from app.rag.vector_store import vector_store
from app.services.llm_service import generate_answer


def answer_question(db: Session, user: User, question: str) -> tuple[str, float, list[Source], list[str]]:
    matches = vector_store.search(question, db, top_k=6)
    if not matches:
        answer = "I do not know based on the uploaded college documents."
        sources: list[Source] = []
        confidence = 0.0
    else:
        context_parts: list[str] = []
        sources = []
        for chunk, score in matches:
            document = db.query(Document).filter(Document.id == chunk.document_id).first()
            if not document:
                continue
            context_parts.append(f"[{document.filename} | {document.module}] {chunk.text}")
            sources.append(
                Source(
                    document_id=document.id,
                    filename=document.filename,
                    module=document.module,
                    chunk_index=chunk.chunk_index,
                    score=round(score, 4),
                    preview=chunk.text[:220],
                )
            )
        context = "\n\n".join(context_parts)
        answer = generate_answer(question, context)
        confidence = round(max(score for _, score in matches), 4)

    suggestions = build_suggestions(question)
    db.add(
        ChatMessage(
            user_id=user.id,
            question=question,
            answer=answer,
            confidence=confidence,
            sources_json=json.dumps([source.model_dump() for source in sources]),
        )
    )
    db.commit()
    return answer, confidence, sources, suggestions


def build_suggestions(question: str) -> list[str]:
    q = question.lower()
    if "fee" in q:
        return ["What is the last date to pay fees?", "Are late fee rules mentioned?"]
    if "exam" in q or "hall ticket" in q:
        return ["What documents are needed for hall ticket collection?", "What are the exam rules?"]
    if "placement" in q:
        return ["What is the placement eligibility?", "Which documents are needed for placement registration?"]
    return ["Show academic regulations", "What are campus rules?", "Summarize the latest circulars"]
