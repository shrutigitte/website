import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

// ─── Admin Credentials (change these) ───
const ADMIN_USER = "prateek";
const ADMIN_PASS = "crush2024";

// ─── Auth Middleware ───
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).send("Authentication required");
  }
  const decoded = Buffer.from(header.slice(6), "base64").toString();
  const [user, pass] = decoded.split(":");
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return next();
  }
  res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
  return res.status(401).send("Invalid credentials");
}

// ─── Database Setup ───
const db = new Database(join(__dirname, "responses.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    data TEXT,
    session_id TEXT,
    visit_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section TEXT NOT NULL,
    answer TEXT,
    meta TEXT,
    session_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Prepared Statements ───
const insertEvent = db.prepare(
  "INSERT INTO events (event, data, session_id, visit_count, created_at) VALUES (?, ?, ?, ?, ?)"
);
const insertInteraction = db.prepare(
  "INSERT INTO interactions (section, answer, meta, session_id, created_at) VALUES (?, ?, ?, ?, ?)"
);
const getAllEvents = db.prepare("SELECT * FROM events ORDER BY id DESC LIMIT ?");
const getAllInteractions = db.prepare("SELECT * FROM interactions ORDER BY id DESC LIMIT ?");
const getStats = db.prepare(`
  SELECT
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM interactions) as total_interactions,
    (SELECT COUNT(DISTINCT session_id) FROM interactions WHERE session_id IS NOT NULL) as unique_sessions
`);
const getSessionList = db.prepare(`
  SELECT
    session_id,
    MIN(created_at) as first_seen,
    MAX(created_at) as last_seen,
    COUNT(*) as interaction_count
  FROM interactions
  WHERE session_id IS NOT NULL
  GROUP BY session_id
  ORDER BY first_seen DESC
  LIMIT ?
`);
const getSessionInteractions = db.prepare(
  "SELECT * FROM interactions WHERE session_id = ? ORDER BY created_at ASC"
);
const getSessionEvents = db.prepare(
  "SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC"
);

// ─── Express App ───
const app = express();
app.use(cors());
app.use(express.json());

// ─── API Routes ───

// Track an event
app.post("/api/track", (req, res) => {
  const { event, data, session_id, visit_count } = req.body;
  if (!event) return res.status(400).json({ error: "event is required" });

  insertEvent.run(
    event,
    typeof data === "object" ? JSON.stringify(data) : data || null,
    session_id || null,
    visit_count || 0,
    new Date().toISOString()
  );
  res.json({ ok: true });
});

// Save an interaction (quiz answer, preference, etc.)
app.post("/api/interaction", (req, res) => {
  const { section, answer, meta, session_id } = req.body;
  if (!section) return res.status(400).json({ error: "section is required" });

  insertInteraction.run(
    section,
    typeof answer === "object" ? JSON.stringify(answer) : answer || null,
    typeof meta === "object" ? JSON.stringify(meta) : meta || null,
    session_id || null,
    new Date().toISOString()
  );
  res.json({ ok: true });
});

// ─── Protected Routes (require login) ───

// Export all data as one JSON (for backup)
app.get("/api/export", requireAuth, (req, res) => {
  const interactions = getAllInteractions.all(10000);
  const events = getAllEvents.all(10000);
  const sessions = getSessionList.all(200);
  res.setHeader("Content-Disposition", "attachment; filename=crush-responses.json");
  res.json({ exported_at: new Date().toISOString(), sessions, interactions, events });
});

// Get all events
app.get("/api/events", requireAuth, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
  res.json(getAllEvents.all(limit));
});

// Get all interactions
app.get("/api/interactions", requireAuth, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
  res.json(getAllInteractions.all(limit));
});

// Get summary stats
app.get("/api/stats", requireAuth, (req, res) => {
  res.json(getStats.get());
});

// Get all sessions (grouped)
app.get("/api/sessions", requireAuth, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  res.json(getSessionList.all(limit));
});

// Get a single session's full journey
app.get("/api/sessions/:id", requireAuth, (req, res) => {
  const sid = req.params.id;
  const interactions = getSessionInteractions.all(sid);
  const events = getSessionEvents.all(sid);
  res.json({ session_id: sid, interactions, events });
});

// Admin Dashboard
app.get("/admin", requireAuth, (req, res) => {
  res.send(adminHTML());
});

function adminHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crush Website — Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0a1a; color: #e2e8f0; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; color: #fff; }
    .subtitle { color: #64748b; font-size: 0.8rem; margin-bottom: 2rem; }
    .stats { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; flex: 1; min-width: 140px; }
    .stat-card .number { font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, #f472b6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .stat-card .label { font-size: 0.7rem; color: #64748b; margin-top: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .section h2 { font-size: 1rem; margin-bottom: 1rem; color: #cbd5e1; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .tab { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #94a3b8; transition: all 0.2s; }
    .tab:hover { border-color: rgba(244,114,182,0.3); color: #f472b6; }
    .tab.active { background: rgba(244,114,182,0.1); border-color: rgba(244,114,182,0.3); color: #f472b6; }
    .refresh-btn { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 10px; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
    .refresh-btn:hover { opacity: 0.9; }
    .session-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.2rem; margin-bottom: 0.8rem; cursor: pointer; transition: all 0.2s; }
    .session-card:hover { border-color: rgba(244,114,182,0.3); background: rgba(244,114,182,0.03); }
    .session-card .session-header { display: flex; justify-content: space-between; align-items: center; }
    .session-card .session-id { font-family: monospace; font-size: 0.8rem; color: #a78bfa; }
    .session-card .session-time { font-size: 0.7rem; color: #64748b; }
    .session-card .session-count { font-size: 0.7rem; color: #94a3b8; margin-top: 0.3rem; }
    .journey { margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 10px; }
    .journey-item { display: flex; gap: 0.8rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
    .journey-item:last-child { border-bottom: none; }
    .journey-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    .journey-dot.preference { background: #f472b6; }
    .journey-dot.preference_followup { background: #f9a8d4; }
    .journey-dot.preference_other { background: #f9a8d4; }
    .journey-dot.guess { background: #a78bfa; }
    .journey-dot.would_you_rather { background: #818cf8; }
    .journey-dot.trait_ratings { background: #34d399; }
    .journey-dot.one_word { background: #fbbf24; }
    .journey-dot.vibe_check { background: #fb923c; }
    .journey-dot.deep_question { background: #60a5fa; }
    .journey-dot.final_vibe_check { background: #a78bfa; }
    .journey-dot.vault_unlock { background: #fb923c; }
    .journey-dot.event { background: #64748b; }
    .journey-content { flex: 1; }
    .journey-section { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; }
    .journey-answer { font-size: 0.85rem; color: #e2e8f0; margin-top: 2px; }
    .journey-meta { font-size: 0.7rem; color: #475569; margin-top: 2px; font-style: italic; }
    .journey-time { font-size: 0.65rem; color: #475569; }
    .empty { text-align: center; padding: 3rem; color: #475569; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th, td { padding: 0.6rem 0.8rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.03); }
    th { font-weight: 600; color: #64748b; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .tag { display: inline-block; background: rgba(244,114,182,0.1); color: #f472b6; padding: 2px 8px; border-radius: 20px; font-size: 0.65rem; font-weight: 500; }
    @media (max-width: 600px) { body { padding: 1rem; } .stats { flex-direction: column; } }
  </style>
</head>
<body>
  <h1>Crush Website — Admin</h1>
  <p class="subtitle">All responses grouped by visitor session</p>

  <div class="stats" id="stats"></div>

  <div class="tabs">
    <button class="tab active" onclick="showTab('sessions')">Sessions</button>
    <button class="tab" onclick="showTab('raw')">Raw Data</button>
    <a href="/api/export" class="tab" style="text-decoration:none;margin-left:auto">⬇ Export JSON</a>
    <button class="refresh-btn" onclick="loadAll()">Refresh</button>
  </div>

  <div id="sessions-view">
    <div class="section">
      <h2>Visitor Sessions</h2>
      <div id="sessions-list"><p class="empty">Loading...</p></div>
    </div>
  </div>

  <div id="raw-view" style="display:none">
    <div class="section">
      <h2>All Interactions</h2>
      <div style="overflow-x:auto"><table id="interactions-table"><thead><tr><th>Time</th><th>Session</th><th>Section</th><th>Answer</th><th>Meta</th></tr></thead><tbody></tbody></table></div>
    </div>
    <div class="section">
      <h2>All Events</h2>
      <div style="overflow-x:auto"><table id="events-table"><thead><tr><th>Time</th><th>Session</th><th>Event</th><th>Data</th></tr></thead><tbody></tbody></table></div>
    </div>
  </div>

  <script>
    const API = window.location.origin;
    let sessionsData = [];

    function showTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('sessions-view').style.display = tab === 'sessions' ? 'block' : 'none';
      document.getElementById('raw-view').style.display = tab === 'raw' ? 'block' : 'none';
    }

    function formatTime(t) {
      return new Date(t).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
    }

    function parseMeta(meta) {
      if (!meta || meta === '{}') return '';
      try {
        const obj = JSON.parse(meta);
        if (obj.question && obj.correct !== undefined) return obj.question + ' ' + (obj.correct ? '✓' : '✗');
        if (obj.question) return obj.question;
        if (obj.correct !== undefined) return obj.correct ? '✓ correct' : '✗ wrong';
        if (obj.index !== undefined) return '#' + (obj.index + 1);
        if (obj.achievement) return obj.achievement;
        if (obj.path) return obj.path;
        return meta;
      } catch { return meta; }
    }

    async function loadAll() {
      const [stats, sessions, interactions, events] = await Promise.all([
        fetch(API + '/api/stats').then(r => r.json()),
        fetch(API + '/api/sessions').then(r => r.json()),
        fetch(API + '/api/interactions?limit=500').then(r => r.json()),
        fetch(API + '/api/events?limit=500').then(r => r.json()),
      ]);

      sessionsData = sessions;

      document.getElementById('stats').innerHTML =
        '<div class="stat-card"><div class="number">' + stats.unique_sessions + '</div><div class="label">Unique Visitors</div></div>' +
        '<div class="stat-card"><div class="number">' + stats.total_interactions + '</div><div class="label">Answers Collected</div></div>' +
        '<div class="stat-card"><div class="number">' + stats.total_events + '</div><div class="label">Events Tracked</div></div>';

      // Sessions list
      const list = document.getElementById('sessions-list');
      if (sessions.length === 0) {
        list.innerHTML = '<p class="empty">No sessions yet. Waiting for visitors...</p>';
      } else {
        list.innerHTML = sessions.map(s =>
          '<div class="session-card" onclick="loadSession(\\'' + s.session_id + '\\')">' +
            '<div class="session-header">' +
              '<span class="session-id">' + s.session_id.slice(0,12) + '...</span>' +
              '<span class="session-time">' + formatTime(s.first_seen) + '</span>' +
            '</div>' +
            '<div class="session-count">' + s.interaction_count + ' interactions</div>' +
          '</div>'
        ).join('');
      }

      // Raw tables
      const intBody = document.querySelector('#interactions-table tbody');
      intBody.innerHTML = interactions.map(i =>
        '<tr><td>' + formatTime(i.created_at) + '</td><td style="font-family:monospace;font-size:0.7rem;color:#a78bfa">' + (i.session_id || '-').slice(0,8) + '</td><td><span class="tag">' + i.section + '</span></td><td>' + (i.answer || '-') + '</td><td style="color:#64748b;font-size:0.75rem">' + parseMeta(i.meta) + '</td></tr>'
      ).join('');

      const evBody = document.querySelector('#events-table tbody');
      evBody.innerHTML = events.map(e =>
        '<tr><td>' + formatTime(e.created_at) + '</td><td style="font-family:monospace;font-size:0.7rem;color:#a78bfa">' + (e.session_id || '-').slice(0,8) + '</td><td><span class="tag">' + e.event + '</span></td><td style="color:#94a3b8">' + (e.data || '-') + '</td></tr>'
      ).join('');
    }

    async function loadSession(sid) {
      const data = await fetch(API + '/api/sessions/' + sid).then(r => r.json());
      const list = document.getElementById('sessions-list');

      let html = '<div style="margin-bottom:1rem"><button class="tab" onclick="loadAll()">← Back to all sessions</button> <span style="font-family:monospace;font-size:0.8rem;color:#a78bfa;margin-left:0.5rem">' + sid.slice(0,12) + '</span></div>';

      html += '<div class="journey">';

      // Combine and sort chronologically
      const items = [
        ...data.interactions.map(i => ({ ...i, _type: 'interaction' })),
        ...data.events.map(e => ({ ...e, _type: 'event' })),
      ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      if (items.length === 0) {
        html += '<p class="empty">No data for this session</p>';
      } else {
        items.forEach(item => {
          if (item._type === 'interaction') {
            html += '<div class="journey-item">' +
              '<div class="journey-dot ' + item.section + '"></div>' +
              '<div class="journey-content">' +
                '<div class="journey-section">' + item.section + '</div>' +
                '<div class="journey-answer">' + (item.answer || '-') + '</div>' +
                (item.meta && item.meta !== '{}' ? '<div class="journey-meta">' + parseMeta(item.meta) + '</div>' : '') +
              '</div>' +
              '<div class="journey-time">' + formatTime(item.created_at) + '</div>' +
            '</div>';
          } else {
            html += '<div class="journey-item">' +
              '<div class="journey-dot event"></div>' +
              '<div class="journey-content">' +
                '<div class="journey-section">event</div>' +
                '<div class="journey-answer" style="color:#94a3b8">' + item.event + '</div>' +
              '</div>' +
              '<div class="journey-time">' + formatTime(item.created_at) + '</div>' +
            '</div>';
          }
        });
      }

      html += '</div>';
      list.innerHTML = html;
    }

    loadAll();
  </script>
</body>
</html>`;
}

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │  Crush Website Backend                  │
  │                                         │
  │  API:    http://localhost:${PORT}/api     │
  │  Admin:  http://localhost:${PORT}/admin   │
  │  DB:     ./responses.db                 │
  └─────────────────────────────────────────┘
  `);
});
