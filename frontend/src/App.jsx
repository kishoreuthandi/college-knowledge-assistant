import { useState } from "react";
import Shell from "./components/Shell";
import { useDarkMode } from "./hooks/useDarkMode";
import AdminDashboard from "./pages/AdminDashboard";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import { clearSession } from "./services/api";

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [role, setRole] = useState(() => localStorage.getItem("cka_role"));
  const [view, setView] = useState("chat");

  if (!role) {
    return <LoginPage onAuth={(nextRole) => setRole(nextRole)} />;
  }

  function logout() {
    clearSession();
    setRole(null);
    setView("chat");
  }

  return (
    <Shell role={role} view={view} setView={setView} dark={dark} setDark={setDark} onLogout={logout}>
      {view === "admin" && role === "admin" ? <AdminDashboard /> : <ChatPage />}
    </Shell>
  );
}
