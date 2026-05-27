// ─── Backend Configuration ───
// Points to the Express + SQLite backend
// In development: http://localhost:3001
// In production: set to your deployed backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ─── Track an event ───
export const track = async (event, data = {}) => {
  const payload = {
    event,
    data,
    session_id: getSessionId(),
    visit_count: getVisitCount(),
  };

  try {
    await fetch(`${API_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Backend offline — store locally as fallback
    localStore("event", payload);
  }
};

// ─── Save an interaction (preference, quiz, guess, etc.) ───
export const saveInteraction = async (section, answer, meta = {}) => {
  const payload = {
    section,
    answer: typeof answer === "object" ? JSON.stringify(answer) : answer,
    meta,
    session_id: getSessionId(),
  };

  try {
    await fetch(`${API_URL}/api/interaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    localStore("interaction", payload);
  }
};

// ─── Local fallback storage ───
const localStore = (type, data) => {
  try {
    const existing = JSON.parse(localStorage.getItem("crush_responses") || "[]");
    existing.push({ type, ...data, timestamp: new Date().toISOString() });
    localStorage.setItem("crush_responses", JSON.stringify(existing));
  } catch {}
};

// ─── Export local fallback data (if backend was offline) ───
export const exportResponses = () => {
  const data = localStorage.getItem("crush_responses") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `crush-responses-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Session & Visit helpers ───
export const getSessionId = () => {
  let id = sessionStorage.getItem("crush_session");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("crush_session", id);
  }
  return id;
};

export const getVisitCount = () => {
  return parseInt(localStorage.getItem("crush_visits") || "0", 10);
};

export const incrementVisit = () => {
  const count = getVisitCount() + 1;
  localStorage.setItem("crush_visits", count.toString());
  localStorage.setItem("crush_last_visit", new Date().toISOString());
  return count;
};

export const getLastVisit = () => localStorage.getItem("crush_last_visit");
