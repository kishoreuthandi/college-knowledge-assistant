from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.database.session import get_db
from app.models.entities import Document, User
from app.models.schemas import DocumentResponse
from app.services.document_service import delete_document, save_and_index_document

router = APIRouter(tags=["Documents"])


@router.post("/upload-document", response_model=DocumentResponse)
def upload_document(
    file: UploadFile = File(...),
    module: str = Form("general"),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    try:
        return save_and_index_document(db, file, module, admin)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/documents", response_model=list[DocumentResponse])
def list_documents(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Document).order_by(Document.created_at.desc()).all()


@router.delete("/documents/{document_id}")
def remove_document(document_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    try:
        delete_document(db, document_id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    return {"status": "deleted"}
