import json
from pathlib import Path

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.entities import DocumentChunk


class VectorStore:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.index_path = Path(self.settings.index_dir) / "college.faiss"
        self.map_path = Path(self.settings.index_dir) / "chunk_ids.json"
        self.model = SentenceTransformer(self.settings.embedding_model)
        self.dimension = self.model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatIP(self.dimension)
        self.chunk_ids: list[int] = []
        self._load()

    def _load(self) -> None:
        if self.index_path.exists() and self.map_path.exists():
            self.index = faiss.read_index(str(self.index_path))
            self.chunk_ids = json.loads(self.map_path.read_text(encoding="utf-8"))

    def _persist(self) -> None:
        faiss.write_index(self.index, str(self.index_path))
        self.map_path.write_text(json.dumps(self.chunk_ids), encoding="utf-8")

    def embed(self, texts: list[str]) -> np.ndarray:
        vectors = self.model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
        return np.asarray(vectors, dtype="float32")

    def rebuild(self, db: Session) -> None:
        chunks = db.query(DocumentChunk).order_by(DocumentChunk.id.asc()).all()
        self.index = faiss.IndexFlatIP(self.dimension)
        self.chunk_ids = [chunk.id for chunk in chunks]
        if chunks:
            self.index.add(self.embed([chunk.text for chunk in chunks]))
        self._persist()

    def search(self, query: str, db: Session, top_k: int = 5) -> list[tuple[DocumentChunk, float]]:
        if self.index.ntotal == 0:
            return []
        vector = self.embed([query])
        scores, indices = self.index.search(vector, min(top_k, self.index.ntotal))
        results: list[tuple[DocumentChunk, float]] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0:
                continue
            chunk_id = self.chunk_ids[idx]
            chunk = db.query(DocumentChunk).filter(DocumentChunk.id == chunk_id).first()
            if chunk:
                results.append((chunk, float(score)))
        return results


vector_store = VectorStore()
