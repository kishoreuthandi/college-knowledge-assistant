from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


Role = Literal["admin", "student"]


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=8)
    role: Role = "student"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Role
    full_name: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: Role

    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    id: int
    filename: str
    content_type: str
    module: str
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class Source(BaseModel):
    document_id: int
    filename: str
    module: str
    chunk_index: int
    score: float
    preview: str


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
    confidence: float
    sources: list[Source]
    suggestions: list[str]


class AnalyticsResponse(BaseModel):
    total_documents: int
    total_chunks: int
    total_users: int
    total_queries: int
    top_modules: list[dict]
    recent_queries: list[dict]
