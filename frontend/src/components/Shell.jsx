import { Bot, FileText, LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";

export default function Shell({ role, view, setView, dark, setDark, onLogout, children }) {
  const tabs = role === "admin"
    ? [{ id: "chat", label: "Chat", icon: Bot }, { id: "admin", label: "Admin", icon: LayoutDashboard }]
    : [{ id: "chat", label: "Chat", icon: Bot }];

  return (
    <div className="min-h-screen bg-cloud text-ink dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded bg-brand text-white">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">College Knowledge Assistant</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Grounded answers from campus documents</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex h-10 items-center gap-2 rounded px-3 text-sm ${view === tab.id ? "bg-blue-50 text-brand dark:bg-blue-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                >
                  <Icon size={17} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
            <button className="grid h-10 w-10 place-items-center rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="grid h-10 w-10 place-items-center rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onLogout} aria-label="Logout">
              <LogOut size={18} />
            </button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
