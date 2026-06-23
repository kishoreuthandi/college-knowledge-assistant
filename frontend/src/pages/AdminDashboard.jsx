import { useEffect, useState } from "react";
import { BarChart3, FileUp, Trash2, Users } from "lucide-react";
import { api } from "../services/api";

const modules = ["academic-regulations", "syllabus", "fee-structure", "exam-schedule", "hall-ticket", "placement-cell", "faculty", "campus-rules", "faq", "circular"];

export default function AdminDashboard() {
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [file, setFile] = useState(null);
  const [module, setModule] = useState(modules[0]);
  const [message, setMessage] = useState("");

  async function load() {
    const [docs, stats] = await Promise.all([api.documents(), api.analytics()]);
    setDocuments(docs);
    setAnalytics(stats);
  }

  useEffect(() => { load().catch((err) => setMessage(err.message)); }, []);

  async function upload(event) {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);
    setMessage("Uploading and indexing...");
    try {
      await api.uploadDocument(formData);
      setFile(null);
      setMessage("Document indexed successfully.");
      await load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function remove(id) {
    await api.deleteDocument(id);
    await load();
  }

  const cards = [
    ["Documents", analytics?.total_documents ?? 0, FileUp],
    ["Chunks", analytics?.total_chunks ?? 0, BarChart3],
    ["Users", analytics?.total_users ?? 0, Users],
    ["Queries", analytics?.total_queries ?? 0, BarChart3]
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
              <Icon size={18} className="text-brand" />
            </div>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <form onSubmit={upload} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Upload Document</h2>
          <label className="mb-2 mt-4 block text-sm font-medium">Module</label>
          <select value={module} onChange={(e) => setModule(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            {modules.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="mb-2 mt-4 block text-sm font-medium">PDF, DOCX or TXT</label>
          <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0])} className="w-full rounded border border-dashed border-slate-300 px-3 py-8 text-sm dark:border-slate-700" />
          {message && <p className="mt-4 rounded bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-100">{message}</p>}
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 font-medium text-white">
            <FileUp size={18} /> Upload and Index
          </button>
        </form>

        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Managed Documents</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                <tr>
                  <th className="py-3">File</th>
                  <th>Module</th>
                  <th>Chunks</th>
                  <th>Uploaded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-medium">{doc.filename}</td>
                    <td>{doc.module}</td>
                    <td>{doc.chunk_count}</td>
                    <td>{new Date(doc.created_at).toLocaleString()}</td>
                    <td className="text-right">
                      <button onClick={() => remove(doc.id)} className="rounded p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950" aria-label="Delete document">
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Top Modules</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.top_modules || []).map((item) => (
              <div key={item.module}>
                <div className="mb-1 flex justify-between text-sm"><span>{item.module}</span><span>{item.count}</span></div>
                <div className="h-2 rounded bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded bg-success" style={{ width: `${Math.min(100, item.count * 18)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Recent Queries</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.recent_queries || []).map((item, index) => (
              <div key={index} className="rounded border border-slate-100 p-3 text-sm dark:border-slate-800">
                <p>{item.question}</p>
                <span className="mt-2 block text-xs text-slate-500">Confidence {Math.round(item.confidence * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
