const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export function getToken() {
  return localStorage.getItem("cka_token");
}

export function setSession(session) {
  localStorage.setItem("cka_token", session.access_token);
  localStorage.setItem("cka_role", session.role);
  localStorage.setItem("cka_name", session.full_name);
}

export function clearSession() {
  localStorage.removeItem("cka_token");
  localStorage.removeItem("cka_role");
  localStorage.removeItem("cka_name");
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }
  return response.json();
}

export const api = {
  login: (payload) => request("/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/register", { method: "POST", body: JSON.stringify(payload) }),
  chat: (payload) => request("/chat", { method: "POST", body: JSON.stringify(payload) }),
  history: () => request("/chat/history"),
  downloadHistory: async () => {
    const response = await fetch(`${API_BASE}/chat/history/download`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error("Could not download chat history");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chat-history.txt";
    link.click();
    URL.revokeObjectURL(url);
  },
  documents: () => request("/documents"),
  analytics: () => request("/analytics"),
  uploadDocument: (formData) => request("/upload-document", { method: "POST", body: formData }),
  deleteDocument: (id) => request(`/documents/${id}`, { method: "DELETE" })
};
