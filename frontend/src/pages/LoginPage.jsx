import { useState } from "react";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { api, setSession } from "../services/api";

export default function LoginPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        await api.register(form);
      }
      const session = await api.login({ email: form.email, password: form.password });
      setSession(session);
      onAuth(session.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cloud px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 md:grid-cols-[1fr_420px]">
        <section>
          <div className="mb-6 grid h-14 w-14 place-items-center rounded bg-brand text-white">
            <GraduationCap size={30} />
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-ink dark:text-white md:text-5xl">
            Ask college questions with answers grounded in official documents.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Upload regulations, syllabus, circulars, placement rules and FAQs, then let students search them through a secure assistant.
          </p>
        </section>

        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex rounded bg-slate-100 p-1 dark:bg-slate-800">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded px-3 py-2 text-sm ${mode === "login" ? "bg-white shadow dark:bg-slate-700" : ""}`}>Login</button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded px-3 py-2 text-sm ${mode === "register" ? "bg-white shadow dark:bg-slate-700" : ""}`}>Register</button>
          </div>
          {mode === "register" && (
            <>
              <label className="mb-2 block text-sm font-medium dark:text-slate-100">Full name</label>
              <input className="mb-4 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              <label className="mb-2 block text-sm font-medium dark:text-slate-100">Role</label>
              <select className="mb-4 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <label className="mb-2 block text-sm font-medium dark:text-slate-100">Email</label>
          <input type="email" className="mb-4 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <label className="mb-2 block text-sm font-medium dark:text-slate-100">Password</label>
          <input type="password" className="mb-4 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
          <button className="flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 font-medium text-white disabled:opacity-60" disabled={loading}>
            {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
            {loading ? "Please wait" : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
