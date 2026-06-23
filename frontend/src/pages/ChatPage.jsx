import { useEffect, useRef, useState } from "react";
import { Download, Mic, Send } from "lucide-react";
import SourceList from "../components/SourceList";
import { api } from "../services/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(["What are the academic regulations?", "Show fee structure details", "What are hall ticket instructions?"]);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.history().then((rows) => setMessages(rows.reverse().flatMap((row) => [
      { role: "user", content: row.question },
      { role: "assistant", content: row.answer, sources: row.sources, confidence: row.confidence }
    ]))).catch(() => {});
  }, []);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]);

  async function ask(text = question) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [...current, { role: "user", content: clean }]);
    setQuestion("");
    setTyping(true);
    try {
      const response = await api.chat({ question: clean });
      setMessages((current) => [...current, { role: "assistant", content: response.answer, sources: response.sources, confidence: response.confidence }]);
      setSuggestions(response.suggestions);
    } catch (err) {
      setMessages((current) => [...current, { role: "assistant", content: err.message, sources: [] }]);
    } finally {
      setTyping(false);
    }
  }

  function startVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.onresult = (event) => setQuestion(event.results[0][0].transcript);
    recognition.start();
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[1fr_300px]">
      <section className="flex h-[calc(100vh-7rem)] flex-col rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="font-semibold">Student Chat</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Answers are generated only from uploaded college documents.</p>
        </div>
        <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`max-w-3xl ${message.role === "user" ? "ml-auto" : ""}`}>
              <div className={`rounded-lg px-4 py-3 ${message.role === "user" ? "bg-brand text-white" : "bg-slate-100 dark:bg-slate-800"}`}>
                <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                {typeof message.confidence === "number" && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Confidence: {Math.round(message.confidence * 100)}%</p>}
              </div>
              <SourceList sources={message.sources} />
            </div>
          ))}
          {typing && <div className="w-fit rounded bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800">Assistant is reading documents...</div>}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <button key={item} onClick={() => ask(item)} className="rounded border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">{item}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={startVoice} className="grid h-11 w-11 place-items-center rounded border border-slate-300 dark:border-slate-700" aria-label="Voice input"><Mic size={18} /></button>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask about syllabus, fees, exams, placements..." className="min-w-0 flex-1 rounded border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950" />
            <button onClick={() => ask()} className="grid h-11 w-11 place-items-center rounded bg-brand text-white" aria-label="Send"><Send size={18} /></button>
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <button onClick={() => api.downloadHistory()} className="flex w-full items-center justify-center gap-2 rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-950">
          <Download size={17} /> Download history
        </button>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold">Supported modules</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            {["Academic Regulations", "Syllabus", "Fee Structure", "Exam Schedule", "Hall Ticket", "Placement Cell", "Faculty", "Campus Rules"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </aside>
    </main>
  );
}
