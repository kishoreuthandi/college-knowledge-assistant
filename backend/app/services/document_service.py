import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.entities import Document, DocumentChunk, User
from app.rag.chunking import chunk_text
from app.rag.vector_store import vector_store
from app.services.text_extractor import SUPPORTED_EXTENSIONS, extract_text


def save_and_index_document(db: Session, file: UploadFile, module: str, user: User) -> Document:
    settings = get_settings()
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise ValueError("Only PDF, DOCX and TXT files are supported")

    safe_name = f"{uuid4().hex}{suffix}"
    destination = Path(settings.upload_dir) / safe_name
    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(destination)
    chunks = chunk_text(text)
    if not chunks:
        destination.unlink(missing_ok=True)
        raise ValueError("No readable text found in document")

    document = Document(
        filename=file.filename or safe_name,
        stored_path=str(destination),
        content_type=file.content_type or "application/octet-stream",
        module=module,
        chunk_count=len(chunks),
        uploaded_by=user.id,
    )
    db.add(document)
    db.flush()

    for index, text_chunk in enumerate(chunks):
        db.add(
            DocumentChunk(
                document_id=document.id,
                chunk_index=index,
                text=text_chunk,
                embedding_id=f"{document.id}-{index}",
            )
        )
    db.commit()
    db.refresh(document)
    vector_store.rebuild(db)
    return document


def delete_document(db: Session, document_id: int) -> None:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise LookupError("Document not found")
    Path(document.stored_path).unlink(missing_ok=True)
    db.delete(document)
    db.commit()
    vector_store.rebuild(db)
