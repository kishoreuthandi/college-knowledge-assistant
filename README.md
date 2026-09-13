# College Knowledge Assistant – RAG System

An AI-powered **College Knowledge Assistant** built using **Retrieval-Augmented Generation (RAG)** to provide accurate, context-aware answers from college-specific documents and knowledge sources.

The system allows students and staff to ask questions in natural language and retrieves relevant information from uploaded documents before generating an AI response.

## 🚀 Features

* AI-powered question answering
* Retrieval-Augmented Generation (RAG)
* Document-based knowledge retrieval
* Semantic search
* PDF and document ingestion
* Context-aware responses
* Vector database integration
* Natural language interaction
* College-specific knowledge assistant
* Reduced dependency on manual information search

## 🧠 What is RAG?

Retrieval-Augmented Generation combines **information retrieval** with **Large Language Models (LLMs)**.

Instead of asking an LLM to answer only from its existing knowledge, the system first retrieves relevant information from a private knowledge base and then uses that information to generate the response.

```text
User Question
      ↓
Query Processing
      ↓
Embedding Generation
      ↓
Vector Database Search
      ↓
Relevant Documents
      ↓
Context + User Question
      ↓
LLM
      ↓
Final Answer
```

## 🛠️ Technology Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* FastAPI
* Python
* REST APIs

### AI / Generative AI

* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* Prompt Engineering
* Sentence Transformers
* Text Embeddings

### Vector Database

* ChromaDB

### Database

* SQLite

### Development Tools

* Git
* GitHub
* VS Code

## 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   React UI       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    FastAPI       │
                         │    Backend       │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
           ┌─────────────────┐       ┌─────────────────┐
           │ Query Embedding │       │   SQLite DB     │
           └────────┬────────┘       └─────────────────┘
                    │
                    ▼
           ┌─────────────────┐
           │    ChromaDB     │
           │ Vector Search   │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Relevant Context│
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │      LLM        │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  Final Answer   │
           └─────────────────┘
```

## 📄 Document Processing Pipeline

The system converts college documents into searchable knowledge.

```text
PDF / DOCX / Documents
          ↓
    Text Extraction
          ↓
      Text Cleaning
          ↓
     Text Chunking
          ↓
   Embedding Creation
          ↓
       ChromaDB
          ↓
    Vector Retrieval
```

## 💬 How It Works

### 1. Document Upload

College-related documents such as:

* Academic regulations
* Course information
* Department details
* Exam schedules
* College policies
* Placement information
* Student guidelines

can be added to the knowledge base.

### 2. Text Processing

The system extracts text from the uploaded documents and divides the content into smaller chunks.

### 3. Embedding Generation

Each text chunk is converted into a numerical vector representation using an embedding model.

### 4. Vector Storage

The generated embeddings are stored in **ChromaDB** for efficient semantic search.

### 5. User Query

The user asks a question through the React interface.

### 6. Semantic Retrieval

The question is converted into an embedding and compared with stored document embeddings to identify the most relevant content.

### 7. AI Response

The retrieved context is provided to the LLM along with the user's question.

The LLM generates an answer based on the retrieved college information.

## 🎯 Example Queries

```text
"What are the eligibility requirements for placement?"

"When does the semester examination begin?"

"What documents are required for admission?"

"Tell me about the AI & Data Science department."

"What are the college attendance requirements?"
```

## 📂 Project Structure

```text
college-knowledge-assistant/
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── api/
│   ├── services/
│   ├── rag/
│   ├── models/
│   └── requirements.txt
│
├── documents/
│   └── college_documents/
│
├── vector_db/
│   └── chroma/
│
├── database/
│   └── college.db
│
├── .env
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/college-knowledge-assistant.git
cd college-knowledge-assistant
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file:

```env
LLM_API_KEY=your_api_key
```

Add any additional model or application configuration required by the project.

### 6. Run the Backend

```bash
uvicorn backend.main:app --reload
```

### 7. Run the Frontend

```bash
cd frontend
npm run dev
```

Open the application in your browser.

## 🔐 Security

* API keys are stored using environment variables.
* Sensitive configuration is excluded from version control.
* `.env` files should not be committed to GitHub.

## 📈 Benefits

* Faster access to college information
* Natural-language interaction
* Semantic document search
* Context-aware AI responses
* Centralized college knowledge
* Reduced manual information lookup
* Scalable architecture for additional documents

## 🔮 Future Improvements

* Multi-language support
* Voice-based interaction
* User authentication
* Conversation history
* Admin document management
* Advanced document analytics
* Source citation for every response
* Multi-department knowledge bases
* Cloud deployment
* Role-based access for students, faculty, and administrators

