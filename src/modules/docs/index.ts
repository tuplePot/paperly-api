import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

const page = /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Paperly API · Docs</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:           #0d0f1a;
  --bg-card:      #131625;
  --bg-sidebar:   #0a0c14;
  --bg-hover:     #1a1e30;
  --border:       #1f2340;
  --text:         #dde3f5;
  --text-muted:   #5e6585;
  --text-dim:     #8892b5;

  /* accents */
  --acc-user:     #6366f1;
  --acc-admin:    #f59e0b;
  --acc-pub:      #22c55e;

  /* methods */
  --c-get:    #22c55e;
  --c-post:   #3b82f6;
  --c-put:    #14b8a6;
  --c-patch:  #f59e0b;
  --c-delete: #ef4444;

  --sidebar-w: 230px;
  --radius:    8px;
  --font-mono: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  min-height: 100vh;
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
aside {
  width: var(--sidebar-w);
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  position: fixed;
  top: 0; left: 0; bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 100;
  padding-bottom: 24px;
}
aside::-webkit-scrollbar { width: 4px; }
aside::-webkit-scrollbar-track { background: transparent; }
aside::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.sidebar-logo {
  padding: 20px 16px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.sidebar-logo .logo-icon {
  width: 28px; height: 28px;
  background: linear-gradient(135deg, var(--acc-user), #818cf8);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.sidebar-logo .logo-text { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }
.sidebar-logo .logo-sub  { font-size: 10px; color: var(--text-muted); font-weight: 500; }

.sidebar-section {
  padding: 16px 16px 4px;
}
.sidebar-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.sidebar-section-label .dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.dot-admin { background: var(--acc-admin); }
.dot-user  { background: var(--acc-user); }
.dot-pub   { background: var(--acc-pub); }

.sidebar-section ul { list-style: none; }
.sidebar-section ul li { margin-bottom: 1px; }
.sidebar-section ul li a {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px;
  border-radius: 5px;
  color: var(--text-dim);
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
}
.sidebar-section ul li a:hover,
.sidebar-section ul li a.active {
  color: var(--text);
  background: var(--bg-hover);
}
.sidebar-section ul li a.active { color: white; }
.sidebar-section ul li a .nav-icon { font-size: 13px; width: 16px; text-align: center; }

/* ─── Main ────────────────────────────────────────────────────────────────── */
main {
  margin-left: var(--sidebar-w);
  flex: 1;
  padding: 32px 32px 80px;
  max-width: 860px;
}

/* ─── Stats bar ───────────────────────────────────────────────────────────── */
.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.stat-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  border-radius: 50px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-dim);
}
.stat-pill .stat-num {
  font-size: 18px; font-weight: 800; line-height: 1;
}
.stat-pill.sp-admin .stat-num { color: var(--acc-admin); }
.stat-pill.sp-user  .stat-num { color: var(--acc-user); }
.stat-pill.sp-total .stat-num { color: var(--text); }

/* ─── Section headings ────────────────────────────────────────────────────── */
.section {
  margin-bottom: 48px;
  scroll-margin-top: 24px;
}
.section-header {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.section-stripe {
  width: 4px; height: 28px; border-radius: 2px; flex-shrink: 0;
}
.stripe-admin { background: linear-gradient(180deg, #f59e0b, #d97706); }
.stripe-user  { background: linear-gradient(180deg, #6366f1, #818cf8); }
.stripe-pub   { background: linear-gradient(180deg, #22c55e, #16a34a); }

.section-title {
  font-size: 17px; font-weight: 700; color: var(--text);
}
.section-desc {
  font-size: 12px; color: var(--text-muted);
  margin-top: 1px;
}
.section-badge {
  margin-left: auto;
  font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 50px;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.sb-admin {
  background: rgba(245,158,11,0.12);
  color: var(--acc-admin);
  border: 1px solid rgba(245,158,11,0.25);
}
.sb-user {
  background: rgba(99,102,241,0.12);
  color: var(--acc-user);
  border: 1px solid rgba(99,102,241,0.25);
}
.sb-pub {
  background: rgba(34,197,94,0.10);
  color: #4ade80;
  border: 1px solid rgba(34,197,94,0.25);
}

/* ─── Cards ───────────────────────────────────────────────────────────────── */
.endpoint-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.endpoint-card:hover { border-color: #2a2e50; }

.card-trigger {
  width: 100%; background: none; border: none;
  padding: 13px 16px; cursor: pointer;
  display: flex; align-items: center; gap: 10px;
  text-align: left; color: var(--text);
  transition: background 0.12s;
}
.card-trigger:hover { background: var(--bg-hover); }

.method-badge {
  font-size: 10px; font-weight: 800;
  padding: 2px 8px; border-radius: 4px;
  font-family: var(--font-mono);
  letter-spacing: 0.05em; flex-shrink: 0; min-width: 52px; text-align: center;
}
.badge-get    { background: rgba(34,197,94,0.1);   color: var(--c-get); }
.badge-post   { background: rgba(59,130,246,0.1);  color: var(--c-post); }
.badge-put    { background: rgba(20,184,166,0.1);  color: var(--c-put); }
.badge-patch  { background: rgba(245,158,11,0.1);  color: var(--c-patch); }
.badge-delete { background: rgba(239,68,68,0.1);   color: var(--c-delete); }

.card-path {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
  flex: 1;
}
.card-path .path-param { color: #a5b4fc; }

.card-vis {
  font-size: 11px; color: var(--text-muted); flex-shrink: 0;
}

.auth-badge {
  font-size: 9.5px; font-weight: 700;
  padding: 2px 7px; border-radius: 4px;
  flex-shrink: 0; letter-spacing: 0.05em; text-transform: uppercase;
}
.auth-key {
  background: rgba(245,158,11,0.1);
  color: #fbbf24;
  border: 1px solid rgba(245,158,11,0.2);
}
.auth-jwt {
  background: rgba(99,102,241,0.1);
  color: #a5b4fc;
  border: 1px solid rgba(99,102,241,0.2);
}

.chevron {
  margin-left: 4px; flex-shrink: 0;
  font-size: 10px; color: var(--text-muted);
  transition: transform 0.2s;
}
.open .chevron { transform: rotate(90deg); }

/* ─── Card body ───────────────────────────────────────────────────────────── */
.card-body {
  display: none;
  padding: 0 16px 16px;
  border-top: 1px solid var(--border);
}
.open .card-body { display: block; }

.body-section { margin-top: 14px; }
.body-section-label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--text-muted); margin-bottom: 8px;
  display: flex; align-items: center; gap: 6px;
}
.body-section-label::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* schema block */
.schema-block {
  background: #0a0c14;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.8;
  overflow-x: auto;
  white-space: pre;
}
.j-key    { color: #7dd3fc; }
.j-str    { color: #fde68a; }
.j-num    { color: #a5f3fc; }
.j-bool   { color: #86efac; }
.j-null   { color: #fca5a5; }
.j-brace  { color: var(--text-muted); }

.f-name     { color: #93c5fd; }
.f-type     { color: #a5b4fc; font-style: italic; }
.f-enum     { color: #fde68a; }
.f-required { color: #f87171; font-size: 10px; vertical-align: middle; }
.f-optional { color: #6b7280; font-size: 10px; vertical-align: middle; }
.f-desc     { color: var(--text-muted); }

/* query params table */
.param-table {
  width: 100%; border-collapse: collapse;
  font-size: 12px; font-family: var(--font-mono);
}
.param-table th {
  text-align: left; padding: 5px 10px;
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}
.param-table td {
  padding: 6px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  color: var(--text-dim);
}
.param-table td:first-child { color: #93c5fd; }
.param-table td:nth-child(2) { color: #a5b4fc; font-style: italic; }
.param-table tr:last-child td { border-bottom: none; }

/* response example */
.resp-box {
  background: #0a0c14;
  border: 1px solid var(--border);
  border-left: 3px solid var(--acc-user);
  border-radius: 6px;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.8;
  overflow-x: auto;
  white-space: pre;
}
.resp-box.resp-admin { border-left-color: var(--acc-admin); }

/* note box */
.note-box {
  background: rgba(99,102,241,0.06);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 6px; padding: 10px 14px;
  font-size: 12px; color: var(--text-dim);
  margin-top: 14px; line-height: 1.6;
}
.note-box.note-admin {
  background: rgba(245,158,11,0.06);
  border-color: rgba(245,158,11,0.2);
}
.note-box strong { color: var(--text); }
.note-box code {
  font-family: var(--font-mono);
  font-size: 11px;
  background: rgba(255,255,255,0.06);
  padding: 1px 5px; border-radius: 3px;
  color: #a5b4fc;
}

/* ─── Envelope box ────────────────────────────────────────────────────────── */
.envelope-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 32px;
}
.envelope-box h3 {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 10px;
}

/* ─── Scrollbar ───────────────────────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
</style>
</head>
<body>

<!-- ═══════════════════════════════ SIDEBAR ═════════════════════════════════ -->
<aside>
  <div class="sidebar-logo">
    <div class="logo-icon">📖</div>
    <div>
      <div class="logo-text">Paperly API</div>
      <div class="logo-sub">v1 · Developer Docs</div>
    </div>
  </div>

  <div class="sidebar-section">
    <div class="sidebar-section-label">
      <span class="dot dot-admin"></span>
      Admin — Vault Josh
    </div>
    <ul>
      <li><a href="#admin-books"><span class="nav-icon">📚</span> Books Catalog</a></li>
      <li><a href="#admin-users"><span class="nav-icon">👥</span> Users</a></li>
    </ul>
  </div>

  <div class="sidebar-section">
    <div class="sidebar-section-label">
      <span class="dot dot-pub"></span>
      Auth — Public
    </div>
    <ul>
      <li><a href="#auth"><span class="nav-icon">🔐</span> Register / Login</a></li>
    </ul>
  </div>

  <div class="sidebar-section">
    <div class="sidebar-section-label">
      <span class="dot dot-user"></span>
      User — Paperly App
    </div>
    <ul>
      <li><a href="#me"><span class="nav-icon">🙋</span> Me (Profile)</a></li>
      <li><a href="#books"><span class="nav-icon">📖</span> Books</a></li>
      <li><a href="#library"><span class="nav-icon">🗂</span> Library</a></li>
      <li><a href="#progress"><span class="nav-icon">📊</span> Progress</a></li>
      <li><a href="#bookmarks"><span class="nav-icon">🔖</span> Bookmarks</a></li>
      <li><a href="#highlights"><span class="nav-icon">✏️</span> Highlights</a></li>
    </ul>
  </div>
</aside>

<!-- ═══════════════════════════════ MAIN ════════════════════════════════════ -->
<main>

  <!-- Stats bar -->
  <div class="stats-bar">
    <div class="stat-pill sp-admin">
      <span class="stat-num">15</span>
      <span>Admin endpoints<br/><small style="font-weight:400;font-size:10px">x-api-key required</small></span>
    </div>
    <div class="stat-pill sp-user">
      <span class="stat-num">20</span>
      <span>User endpoints<br/><small style="font-weight:400;font-size:10px">JWT / Public</small></span>
    </div>
    <div class="stat-pill sp-total">
      <span class="stat-num">35</span>
      <span>Total<br/><small style="font-weight:400;font-size:10px">endpoints</small></span>
    </div>
  </div>

  <!-- Response envelope -->
  <div class="envelope-box">
    <h3>Standard Response Envelope</h3>
    <div class="schema-block"><span class="j-brace">{</span>
  <span class="j-key">"success"</span>: <span class="j-bool">true | false</span>,
  <span class="j-key">"message"</span>: <span class="j-str">"Human-readable status"</span>,
  <span class="j-key">"data"</span>: <span class="j-null">null</span> <span style="color:var(--text-muted)">| object | array</span>
<span class="j-brace">}</span></div>
  </div>

  <!-- ═══ ADMIN BOOKS ════════════════════════════════════════════════════════ -->
  <div class="section" id="admin-books">
    <div class="section-header">
      <div class="section-stripe stripe-admin"></div>
      <div>
        <div class="section-title">Books Catalog</div>
        <div class="section-desc">Manage the master book catalog — CRUD, file, and cover assets</div>
      </div>
      <div class="section-badge sb-admin">Admin · x-api-key</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/admin/books/</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Query Params</div>
          <table class="param-table">
            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
            <tr><td>page</td><td>number</td><td>1</td><td>Page number (min 1)</td></tr>
            <tr><td>limit</td><td>number</td><td>20</td><td>Items per page (max 100)</td></tr>
          </table>
        </div>
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box resp-admin"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"books"</span>: [<span class="j-str">...Book[]</span>],
  <span class="j-key">"total"</span>: <span class="j-num">42</span>,
  <span class="j-key">"page"</span>: <span class="j-num">1</span>,
  <span class="j-key">"limit"</span>: <span class="j-num">20</span>
<span class="j-brace">}</span></div>
        </div>
        <div class="note-box note-admin"><strong>Note:</strong> Books listed here exclude <code>file_data</code> and <code>cover_data</code> blobs — those live in separate collections and are fetched via <code>/:id/file</code> and <code>/:id/cover</code>.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-post">POST</span>
        <span class="card-path">/api/admin/books/</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">title</span>        <span class="f-type">string</span>  <span class="f-required">required</span>
<span class="f-name">author</span>       <span class="f-type">string</span>  <span class="f-required">required</span>
<span class="f-name">format</span>       <span class="f-type">enum</span>    <span class="f-required">required</span>   <span class="f-enum">"epub" | "pdf" | "txt"</span>
<span class="f-name">file_data</span>    <span class="f-type">string</span>  <span class="f-optional">optional</span>  <span class="f-desc">base64 encoded file</span>
<span class="f-name">cover_data</span>   <span class="f-type">string</span>  <span class="f-optional">optional</span>  <span class="f-desc">base64 encoded cover image</span>
<span class="f-name">file_size</span>    <span class="f-type">number</span>  <span class="f-optional">optional</span>  <span class="f-desc">bytes</span>
<span class="f-name">uploaded_by</span>  <span class="f-type">string</span>  <span class="f-optional">optional</span></div>
        </div>
        <div class="note-box note-admin">If <code>file_data</code> or <code>cover_data</code> are provided, they are automatically split into the <code>BookFile</code> / <code>BookCover</code> collections.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box note-admin">Returns book metadata by <code>_id</code> (24-char hex ObjectId). 404 if not found.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-put">PUT</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body (all optional)</div>
          <div class="schema-block"><span class="f-name">title</span>       <span class="f-type">string</span>  <span class="f-optional">optional</span>
<span class="f-name">author</span>      <span class="f-type">string</span>  <span class="f-optional">optional</span>
<span class="f-name">format</span>      <span class="f-type">enum</span>    <span class="f-optional">optional</span>  <span class="f-enum">"epub" | "pdf" | "txt"</span>
<span class="f-name">file_size</span>   <span class="f-type">number</span>  <span class="f-optional">optional</span>
<span class="f-name">uploaded_by</span> <span class="f-type">string</span>  <span class="f-optional">optional</span></div>
        </div>
        <div class="note-box note-admin">Use <code>PUT /:id/file</code> and <code>PUT /:id/cover</code> to update binary assets separately.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-delete">DELETE</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box note-admin">Cascades: also deletes the associated <code>BookFile</code> and <code>BookCover</code> documents.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span>/file</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box resp-admin"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"book_id"</span>:   <span class="j-str">"&lt;ObjectId&gt;"</span>,
  <span class="j-key">"file_data"</span>: <span class="j-str">"&lt;base64 string&gt;"</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-put">PUT</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span>/file</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">file_data</span> <span class="f-type">string</span> <span class="f-required">required</span>  <span class="f-desc">base64 encoded file content</span></div>
        </div>
        <div class="note-box note-admin">Upserts — creates if not exists, replaces if already exists.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-delete">DELETE</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span>/file</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box note-admin">Removes only the <code>BookFile</code> record — the parent <code>Book</code> document is untouched.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span>/cover</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box resp-admin"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"book_id"</span>:    <span class="j-str">"&lt;ObjectId&gt;"</span>,
  <span class="j-key">"cover_data"</span>: <span class="j-str">"&lt;base64 string&gt;"</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-put">PUT</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span>/cover</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">cover_data</span> <span class="f-type">string</span> <span class="f-required">required</span>  <span class="f-desc">base64 encoded cover image</span></div>
        </div>
        <div class="note-box note-admin">Upserts — creates if not exists, replaces if already exists.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-delete">DELETE</span>
        <span class="card-path">/api/admin/books/<span class="path-param">:id</span>/cover</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box note-admin">Removes only the <code>BookCover</code> record — the parent <code>Book</code> document is untouched.</div>
      </div>
    </div>
  </div>

  <!-- ═══ ADMIN USERS ═══════════════════════════════════════════════════════ -->
  <div class="section" id="admin-users">
    <div class="section-header">
      <div class="section-stripe stripe-admin"></div>
      <div>
        <div class="section-title">Users</div>
        <div class="section-desc">View, moderate, and manage reader accounts</div>
      </div>
      <div class="section-badge sb-admin">Admin · x-api-key</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/admin/users/</span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Query Params</div>
          <table class="param-table">
            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
            <tr><td>page</td><td>number</td><td>1</td><td>Page number</td></tr>
            <tr><td>limit</td><td>number</td><td>20</td><td>Items per page (max 100)</td></tr>
          </table>
        </div>
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box resp-admin"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"users"</span>: [<span class="j-str">...User[]</span>],  <span style="color:var(--text-muted)">// password omitted</span>
  <span class="j-key">"total"</span>: <span class="j-num">128</span>,
  <span class="j-key">"page"</span>: <span class="j-num">1</span>,
  <span class="j-key">"limit"</span>: <span class="j-num">20</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/admin/users/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box note-admin">Returns full user object (password excluded). 404 if not found.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-patch">PATCH</span>
        <span class="card-path">/api/admin/users/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body (all optional)</div>
          <div class="schema-block"><span class="f-name">display_name</span>  <span class="f-type">string</span>   <span class="f-optional">optional</span>  <span class="f-desc">1–100 chars</span>
<span class="f-name">role</span>           <span class="f-type">enum</span>     <span class="f-optional">optional</span>  <span class="f-enum">"user" | "admin"</span>
<span class="f-name">is_suspended</span>   <span class="f-type">boolean</span>  <span class="f-optional">optional</span>  <span class="f-desc">suspend / unsuspend account</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-delete">DELETE</span>
        <span class="card-path">/api/admin/users/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-key">API-KEY</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box note-admin">Permanently deletes the account. Consider <code>is_suspended: true</code> for a reversible alternative.</div>
      </div>
    </div>
  </div>

  <!-- ═══ AUTH ══════════════════════════════════════════════════════════════ -->
  <div class="section" id="auth">
    <div class="section-header">
      <div class="section-stripe stripe-pub"></div>
      <div>
        <div class="section-title">Auth</div>
        <div class="section-desc">Register and log in — returns a JWT signed HS256, 7-day TTL</div>
      </div>
      <div class="section-badge sb-pub">Public</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-post">POST</span>
        <span class="card-path">/api/v1/auth/register</span>
        <span class="card-vis">Public</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">email</span>         <span class="f-type">string</span>  <span class="f-required">required</span>  <span class="f-desc">valid email format</span>
<span class="f-name">password</span>      <span class="f-type">string</span>  <span class="f-required">required</span>  <span class="f-desc">min 8 chars, hashed with Bun.password</span>
<span class="f-name">display_name</span>  <span class="f-type">string</span>  <span class="f-optional">optional</span></div>
        </div>
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"token"</span>: <span class="j-str">"eyJ..."</span>,
  <span class="j-key">"user"</span>: <span class="j-brace">{</span> <span class="j-key">"_id"</span>, <span class="j-key">"email"</span>, <span class="j-key">"display_name"</span>, <span class="j-key">"role"</span> <span class="j-brace">}</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-post">POST</span>
        <span class="card-path">/api/v1/auth/login</span>
        <span class="card-vis">Public</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">email</span>     <span class="f-type">string</span>  <span class="f-required">required</span>
<span class="f-name">password</span>  <span class="f-type">string</span>  <span class="f-required">required</span></div>
        </div>
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"token"</span>: <span class="j-str">"eyJ..."</span>,
  <span class="j-key">"user"</span>: <span class="j-brace">{</span> <span class="j-key">"_id"</span>, <span class="j-key">"email"</span>, <span class="j-key">"display_name"</span>, <span class="j-key">"role"</span> <span class="j-brace">}</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ ME ════════════════════════════════════════════════════════════════ -->
  <div class="section" id="me">
    <div class="section-header">
      <div class="section-stripe stripe-user"></div>
      <div>
        <div class="section-title">Me — Profile</div>
        <div class="section-desc">Read and update the authenticated user's own profile</div>
      </div>
      <div class="section-badge sb-user">JWT required</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/me</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"_id"</span>, <span class="j-key">"email"</span>, <span class="j-key">"display_name"</span>, <span class="j-key">"role"</span>,
  <span class="j-key">"createdAt"</span>, <span class="j-key">"updatedAt"</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-patch">PATCH</span>
        <span class="card-path">/api/v1/me</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body (all optional)</div>
          <div class="schema-block"><span class="f-name">display_name</span>  <span class="f-type">string</span>  <span class="f-optional">optional</span>  <span class="f-desc">1–100 chars</span>
<span class="f-name">password</span>      <span class="f-type">string</span>  <span class="f-optional">optional</span>  <span class="f-desc">min 8 chars — re-hashed on update</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ BOOKS (user-facing) ═══════════════════════════════════════════════ -->
  <div class="section" id="books">
    <div class="section-header">
      <div class="section-stripe stripe-user"></div>
      <div>
        <div class="section-title">Books</div>
        <div class="section-desc">Browse catalog and fetch assets — file download requires JWT + library membership</div>
      </div>
      <div class="section-badge sb-pub">Mostly Public</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/books/</span>
        <span class="card-vis">Public</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Query Params</div>
          <table class="param-table">
            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
            <tr><td>page</td><td>number</td><td>1</td><td>Page number</td></tr>
            <tr><td>limit</td><td>number</td><td>20</td><td>Items per page (max 100)</td></tr>
          </table>
        </div>
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"books"</span>: [<span class="j-brace">{</span>
    <span class="j-key">"_id"</span>, <span class="j-key">"title"</span>, <span class="j-key">"author"</span>, <span class="j-key">"format"</span>, <span class="j-key">"file_size"</span>
    <span style="color:var(--text-muted)">// no file_data / cover_data</span>
  <span class="j-brace">}</span>],
  <span class="j-key">"total"</span>: <span class="j-num">42</span>, <span class="j-key">"page"</span>: <span class="j-num">1</span>, <span class="j-key">"limit"</span>: <span class="j-num">20</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/books/<span class="path-param">:id</span></span>
        <span class="card-vis">Public</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box">Returns book metadata (no binary blobs). 404 if not found.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/books/<span class="path-param">:id</span>/cover</span>
        <span class="card-vis">Public</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"book_id"</span>:    <span class="j-str">"&lt;ObjectId&gt;"</span>,
  <span class="j-key">"cover_data"</span>: <span class="j-str">"&lt;base64&gt;"</span>
<span class="j-brace">}</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/books/<span class="path-param">:id</span>/file</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"book_id"</span>:   <span class="j-str">"&lt;ObjectId&gt;"</span>,
  <span class="j-key">"file_data"</span>: <span class="j-str">"&lt;base64&gt;"</span>
<span class="j-brace">}</span></div>
        </div>
        <div class="note-box"><strong>Access control:</strong> User must have the book in their library (<code>UserLibrary</code>) — otherwise returns 403.</div>
      </div>
    </div>
  </div>

  <!-- ═══ LIBRARY ══════════════════════════════════════════════════════════ -->
  <div class="section" id="library">
    <div class="section-header">
      <div class="section-stripe stripe-user"></div>
      <div>
        <div class="section-title">Library</div>
        <div class="section-desc">User's personal book shelf — add, remove, and favorite books</div>
      </div>
      <div class="section-badge sb-user">JWT required</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/library/</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: [<span class="j-brace">{</span>
  <span class="j-key">"_id"</span>, <span class="j-key">"added_at"</span>, <span class="j-key">"is_favorite"</span>,
  <span class="j-key">"book_id"</span>: <span class="j-brace">{</span> <span class="j-key">"_id"</span>, <span class="j-key">"title"</span>, <span class="j-key">"author"</span>, <span class="j-key">"format"</span> <span class="j-brace">}</span>
<span class="j-brace">}</span>]</div>
        </div>
        <div class="note-box"><code>book_id</code> is populated with book metadata (no binary blobs).</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-post">POST</span>
        <span class="card-path">/api/v1/library/<span class="path-param">:bookId</span></span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box">Adds the book to the user's library. Returns 409 if already present, 404 if book doesn't exist. No request body required.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-delete">DELETE</span>
        <span class="card-path">/api/v1/library/<span class="path-param">:bookId</span></span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box">Removes the book from the user's library. 404 if the entry doesn't exist.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-patch">PATCH</span>
        <span class="card-path">/api/v1/library/<span class="path-param">:bookId</span>/favorite</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box">Toggles <code>is_favorite</code> on the library entry. No request body. Returns the updated entry.</div>
      </div>
    </div>
  </div>

  <!-- ═══ PROGRESS ══════════════════════════════════════════════════════════ -->
  <div class="section" id="progress">
    <div class="section-header">
      <div class="section-stripe stripe-user"></div>
      <div>
        <div class="section-title">Reading Progress</div>
        <div class="section-desc">Persist and restore the user's reading position per book</div>
      </div>
      <div class="section-badge sb-user">JWT required</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/progress/<span class="path-param">:bookId</span></span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: <span class="j-brace">{</span>
  <span class="j-key">"user_id"</span>:          <span class="j-str">"&lt;ObjectId&gt;"</span>,
  <span class="j-key">"book_id"</span>:          <span class="j-str">"&lt;ObjectId&gt;"</span>,
  <span class="j-key">"current_page"</span>:     <span class="j-num">42</span>,
  <span class="j-key">"total_pages"</span>:      <span class="j-num">320</span>,
  <span class="j-key">"scroll_position"</span>: <span class="j-num">1024</span>,
  <span class="j-key">"percentage"</span>:       <span class="j-num">13.1</span>,
  <span class="j-key">"updatedAt"</span>:        <span class="j-str">"2025-01-01T00:00:00Z"</span>
<span class="j-brace">}</span></div>
        </div>
        <div class="note-box">Returns 404 if no progress has been saved yet for this book.</div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-put">PUT</span>
        <span class="card-path">/api/v1/progress/<span class="path-param">:bookId</span></span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">current_page</span>     <span class="f-type">number</span>  <span class="f-required">required</span>
<span class="f-name">total_pages</span>      <span class="f-type">number</span>  <span class="f-required">required</span>
<span class="f-name">scroll_position</span>  <span class="f-type">number</span>  <span class="f-optional">optional</span>  <span class="f-desc">pixel offset for reflowable content</span>
<span class="f-name">percentage</span>       <span class="f-type">number</span>  <span class="f-optional">optional</span>  <span class="f-desc">0–100, calculated by client</span></div>
        </div>
        <div class="note-box"><strong>Upsert:</strong> creates if no record exists, otherwise replaces. Safe to call on every page turn.</div>
      </div>
    </div>
  </div>

  <!-- ═══ BOOKMARKS ════════════════════════════════════════════════════════ -->
  <div class="section" id="bookmarks">
    <div class="section-header">
      <div class="section-stripe stripe-user"></div>
      <div>
        <div class="section-title">Bookmarks</div>
        <div class="section-desc">Server-side bookmarks — page positions saved across devices</div>
      </div>
      <div class="section-badge sb-user">JWT required</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/bookmarks/</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Query Params</div>
          <table class="param-table">
            <tr><th>Name</th><th>Type</th><th>Description</th></tr>
            <tr><td>bookId</td><td>ObjectId string</td><td>Filter by book (optional)</td></tr>
          </table>
        </div>
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: [<span class="j-brace">{</span>
  <span class="j-key">"_id"</span>, <span class="j-key">"book_id"</span>, <span class="j-key">"page"</span>, <span class="j-key">"label"</span>, <span class="j-key">"createdAt"</span>
<span class="j-brace">}</span>]</div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-post">POST</span>
        <span class="card-path">/api/v1/bookmarks/</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">book_id</span>  <span class="f-type">ObjectId string</span>  <span class="f-required">required</span>
<span class="f-name">page</span>     <span class="f-type">number</span>          <span class="f-required">required</span>
<span class="f-name">label</span>    <span class="f-type">string</span>          <span class="f-optional">optional</span>  <span class="f-desc">user-defined note</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-delete">DELETE</span>
        <span class="card-path">/api/v1/bookmarks/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box">Deletes the bookmark by its <code>_id</code>. Only the owning user can delete it — enforced via <code>user_id</code> filter.</div>
      </div>
    </div>
  </div>

  <!-- ═══ HIGHLIGHTS ════════════════════════════════════════════════════════ -->
  <div class="section" id="highlights">
    <div class="section-header">
      <div class="section-stripe stripe-user"></div>
      <div>
        <div class="section-title">Highlights</div>
        <div class="section-desc">Text selections with optional annotation notes, synced across devices</div>
      </div>
      <div class="section-badge sb-user">JWT required</div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-get">GET</span>
        <span class="card-path">/api/v1/highlights/</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Query Params</div>
          <table class="param-table">
            <tr><th>Name</th><th>Type</th><th>Description</th></tr>
            <tr><td>bookId</td><td>ObjectId string</td><td>Filter by book (optional)</td></tr>
          </table>
        </div>
        <div class="body-section">
          <div class="body-section-label">Response</div>
          <div class="resp-box"><span class="j-key">"data"</span>: [<span class="j-brace">{</span>
  <span class="j-key">"_id"</span>, <span class="j-key">"book_id"</span>,
  <span class="j-key">"selected_text"</span>,
  <span class="j-key">"position_start"</span>: <span class="j-num">1024</span>,
  <span class="j-key">"position_end"</span>:   <span class="j-num">1260</span>,
  <span class="j-key">"color"</span>: <span class="j-str">"yellow"</span>,
  <span class="j-key">"note"</span>:  <span class="j-str">"Optional annotation"</span>
<span class="j-brace">}</span>]</div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-post">POST</span>
        <span class="card-path">/api/v1/highlights/</span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="body-section">
          <div class="body-section-label">Request Body</div>
          <div class="schema-block"><span class="f-name">book_id</span>         <span class="f-type">ObjectId string</span>  <span class="f-required">required</span>
<span class="f-name">selected_text</span>   <span class="f-type">string</span>          <span class="f-required">required</span>
<span class="f-name">position_start</span>  <span class="f-type">number</span>          <span class="f-required">required</span>  <span class="f-desc">byte/char offset</span>
<span class="f-name">position_end</span>    <span class="f-type">number</span>          <span class="f-required">required</span>
<span class="f-name">color</span>           <span class="f-type">string</span>          <span class="f-optional">optional</span>  <span class="f-desc">e.g. "yellow", "green"</span>
<span class="f-name">note</span>            <span class="f-type">string</span>          <span class="f-optional">optional</span>  <span class="f-desc">annotation text</span></div>
        </div>
      </div>
    </div>

    <div class="endpoint-card">
      <button class="card-trigger" onclick="toggle(this)">
        <span class="method-badge badge-delete">DELETE</span>
        <span class="card-path">/api/v1/highlights/<span class="path-param">:id</span></span>
        <span class="auth-badge auth-jwt">JWT</span>
        <span class="chevron">▶</span>
      </button>
      <div class="card-body">
        <div class="note-box">Deletes the highlight by its <code>_id</code>. Ownership enforced via <code>user_id</code> filter.</div>
      </div>
    </div>
  </div>

</main>

<script>
function toggle(btn) {
  btn.closest('.endpoint-card').classList.toggle('open')
}

const sections = document.querySelectorAll('.section[id]')
const navLinks  = document.querySelectorAll('aside a[href^="#"]')
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'))
      const active = document.querySelector('aside a[href="#' + e.target.id + '"]')
      if (active) active.classList.add('active')
    }
  })
}, { rootMargin: '-20% 0px -70% 0px' })
sections.forEach(s => io.observe(s))
</script>
</body>
</html>`

//cek
export const docsModule = new Elysia()
  .use(html())
  .get('/docs', () => page)
