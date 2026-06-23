from openai import OpenAI

from app.config import get_settings


SYSTEM_PROMPT = """You are a college knowledge assistant. Answer only from the supplied context.
If the answer is not present, say you do not know based on the uploaded documents.
Keep answers concise, student-friendly, and include no unsupported claims."""


def generate_answer(question: str, context: str) -> str:
    settings = get_settings()
    if not settings.openai_api_key:
        return (
            "I found relevant uploaded document context, but no LLM API key is configured. "
            "Based on the retrieved text, here is the most relevant excerpt:\n\n"
            f"{context[:1200]}"
        )

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.2,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Question: {question}\n\nContext:\n{context}"},
        ],
    )
    return response.choices[0].message.content or "I could not generate an answer."
