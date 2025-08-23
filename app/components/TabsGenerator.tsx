"use client";

import React, { useEffect, useMemo, useState } from "react";

type Tab = { title: string; content: string };

// localStorage keys
const LS_TABS = "tg.tabs.v1";
const LS_ACTIVE = "tg.active.v1";

export default function TabsGenerator() {
  // left column: tabs you’re designing
  const [tabs, setTabs] = useState<Tab[]>([
    { title: "Tab 1", content: "Welcome!" },
    { title: "Tab 2", content: "Install VSCode\nInstall Chrome\nInstall Node" },
  ]);
  const [active, setActive] = useState(0); // index of selected tab in editor

  // ---- PERSISTENCE: load once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_TABS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          const safe = parsed.map((t: any, i: number) => ({
            title: typeof t?.title === "string" ? t.title : `Tab ${i + 1}`,
            content: typeof t?.content === "string" ? t.content : "",
          }));
          setTabs(safe);
        }
      }
      const a = localStorage.getItem(LS_ACTIVE);
      if (a !== null) {
        const idx = parseInt(a, 10);
        if (!Number.isNaN(idx) && idx >= 0 && idx < tabs.length) {
          setActive(idx);
        }
      }
    } catch {
      // ignore parse/storage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- PERSISTENCE: save on change
  useEffect(() => {
    try {
      localStorage.setItem(LS_TABS, JSON.stringify(tabs));
    } catch {}
  }, [tabs]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_ACTIVE, String(active));
    } catch {}
  }, [active]);

  // --- helpers
  function addTab() {
    setTabs((prev) => {
      const next = [...prev, { title: `Tab ${prev.length + 1}`, content: "" }];
      setActive(prev.length);
      return next;
    });
  }
  function updateTab(i: number, patch: Partial<Tab>) {
    setTabs((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }
  function removeTab(i: number) {
    setTabs((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      setActive((prevActive) => Math.max(0, Math.min(prevActive, next.length - 1)));
      return next;
    });
  }

  function escapeHtml(s: string) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // --- right column: generated single-file HTML (HTML + inline CSS + JS)
  const output = useMemo(() => {
    const headers = tabs
      .map(
        (t, i) =>
          `<button class="tab" role="tab" id="tab-${i + 1}" aria-selected="${i === 0}" aria-controls="panel-${i + 1}" ${
            i === 0 ? "" : 'tabindex="-1"'
          }><span class="num">${i + 1}.</span> ${escapeHtml(t.title || `Tab ${i + 1}`)}</button>`
      )
      .join("\n      ");

    const panels = tabs
      .map(
        (t, i) =>
          `<section id="panel-${i + 1}" role="tabpanel" aria-labelledby="tab-${i + 1}" ${i === 0 ? "" : "hidden"}>
  <h3>${escapeHtml(t.title || `Tab ${i + 1}`)}</h3>
  ${escapeHtml(t.content).replaceAll("\n", "<br/>")}
</section>`
      )
      .join("\n    ");

    return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tabs – Generated</title>
  <style>
    :root { color-scheme: light dark; }
    html[data-theme="light"]{
      --bg:#ffffff; --text:#111; --muted:#6b7280; --border:#cbd5e1; --focus:#2563eb;
      --panel:#ffffff; --tab-bg:#f8fafc; --tab-active:#ffffff; --tab-text:#111; --chip:#e5e7eb;
    }
    html[data-theme="dark"]{
      --bg:#0b0f14; --text:#e5e7eb; --muted:#9ca3af; --border:#334155; --focus:#60a5fa;
      --panel:#0f151d; --tab-bg:#0f151d; --tab-active:#111827; --tab-text:#e5e7eb; --chip:#1f2937;
    }

    *{box-sizing:border-box}
    body{margin:0; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.45;
         background:var(--bg); color:var(--text); padding:16px;}
    header{display:flex; align-items:center; gap:12px; margin-bottom:12px}
    .student{font-weight:600; padding:4px 8px; border:1px solid var(--border); border-radius:6px}
    .spacer{flex:1}

    #themeToggle{border:1px solid var(--border); background:var(--panel); color:var(--text);
      padding:6px 10px; border-radius:8px; cursor:pointer}
    #themeToggle:focus{outline:3px solid var(--focus); outline-offset:2px}

    .tablist{display:flex; gap:8px; border-bottom:2px solid var(--border); padding-bottom:8px; flex-wrap:wrap}
    .tab{
      display:inline-flex; align-items:center; gap:8px;
      border:1px solid var(--border);
      padding:8px 12px; border-radius:10px; background:var(--tab-bg); color:var(--tab-text);
      cursor:pointer; user-select:none;
    }
    .tab[aria-selected="true"]{
      background:var(--tab-active);
      box-shadow:0 1px 0 var(--panel) inset;
      border-bottom-color:transparent;
      font-weight:600;
    }
    .tab:focus{outline:3px solid var(--focus); outline-offset:2px}
    .num{display:inline-block; padding:2px 6px; border-radius:8px; background:var(--chip); font-weight:600}

    [role="tabpanel"]{
      border:1px solid var(--border); border-top:none; padding:12px;
      border-radius:0 10px 10px 10px; background:var(--panel); margin-top:-1px;
    }

    footer{margin-top:24px; font-size:14px; color:var(--muted)}
  </style>
</head>
<body>
  <header>
    <div class="student" aria-label="Student number">20224948</div>
    <h1 style="margin:0">Tabs</h1>
    <div class="spacer"></div>
    <button id="themeToggle" type="button" aria-label="Toggle theme">Light</button>
  </header>

  <div class="tablist" role="tablist" aria-label="Content Tabs" id="tabs">
      ${headers}
  </div>

    ${panels}

  <footer>
    © <span id="year"></span> Mark Prado • Student: 20224948 • <span id="date"></span>
  </footer>

  <script>
    (function(){
      var COOKIE = 'theme';
      function setCookie(name, value, days){
        var d = new Date(); d.setTime(d.getTime() + days*24*60*60*1000);
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + d.toUTCString();
      }
      function getCookie(name){
        var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
        return m ? decodeURIComponent(m[1]) : '';
      }
      var html = document.documentElement;
      var btn = document.getElementById('themeToggle');
      function applyLabel(){ btn.textContent = html.dataset.theme === 'dark' ? 'Dark' : 'Light'; }
      var saved = getCookie(COOKIE);
      if(saved === 'light' || saved === 'dark'){ html.dataset.theme = saved; }
      applyLabel();
      btn.addEventListener('click', function(){
        html.dataset.theme = (html.dataset.theme === 'dark' ? 'light' : 'dark');
        setCookie(COOKIE, html.dataset.theme, 365);
        applyLabel();
      });

      var tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      var KEY = 'lastTabIndex';
      function setActive(index, focus){
        tabs.forEach(function(t, i){
          var sel = i === index;
          t.setAttribute('aria-selected', String(sel));
          t.tabIndex = sel ? 0 : -1;
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if(panel) panel.hidden = !sel;
        });
        if(focus) tabs[index].focus();
        document.cookie = KEY + '=' + index + '; path=/; max-age=' + (60*60*24*30);
      }
      function getCookieSimple(name){
        return ('; ' + document.cookie).split('; ' + name + '=').pop().split(';').shift();
      }
      tabs.forEach(function(tab, i){
        tab.addEventListener('click', function(){ setActive(i, false); });
        tab.addEventListener('keydown', function(e){
          var current = tabs.findIndex(function(t){ return t.getAttribute('aria-selected') === 'true'; });
          if(e.key === 'ArrowRight'){ e.preventDefault(); setActive((current+1)%tabs.length, true); }
          else if(e.key === 'ArrowLeft'){ e.preventDefault(); setActive((current-1+tabs.length)%tabs.length, true); }
          else if(e.key === 'Home'){ e.preventDefault(); setActive(0, true); }
          else if(e.key === 'End'){ e.preventDefault(); setActive(tabs.length-1, true); }
          else if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setActive(current, false); }
        });
      });
      var savedIdx = parseInt(getCookieSimple(KEY), 10);
      if(!isNaN(savedIdx) && savedIdx >= 0 && savedIdx < tabs.length) setActive(savedIdx, false);

      document.getElementById('year').textContent = new Date().getFullYear();
      document.getElementById('date').textContent = new Date().toLocaleDateString();
    })();
  </script>
</body>
</html>`;
  }, [tabs]);

  // Download the generated code as an HTML file
  function downloadHtml() {
    const blob = new Blob([output], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tabs.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- layout styles for the builder (unchanged)
  const box: React.CSSProperties = {
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 12,
    background: "var(--panel)",
  };
  const btn: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    cursor: "pointer",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--panel)",
    color: "var(--text)",
    boxSizing: "border-box",
  };

  return (
    <main>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)", // always stacked
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* LEFT: editor (tabs + fields) */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Tabs</h2>
            <button onClick={addTab} title="Add tab" style={btn}>
              + Add
            </button>
          </div>

          {/* headers list */}
          <div style={{ ...box, display: "grid", gap: 8, marginBottom: 12, minWidth: 0 }}>
            {tabs.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0 }}>
                <button
                  onClick={() => setActive(i)}
                  style={{
                    ...btn,
                    flex: "1 1 auto",
                    minWidth: 0,
                    maxWidth: "100%",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    outline: i === active ? `2px solid var(--accent)` : "none",
                  }}
                >
                  {t.title || `Tab ${i + 1}`}
                </button>
                <button
                  onClick={() => removeTab(i)}
                  aria-label={`Remove ${t.title || `Tab ${i + 1}`}`}
                  title="Remove"
                  style={btn}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* active tab editor */}
          <div style={{ ...box }}>
            <label style={{ display: "block", fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Title</label>
            <input
              value={tabs[active]?.title ?? ""}
              onChange={(e) => updateTab(active, { title: e.target.value })}
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <label style={{ display: "block", fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Content</label>
            <textarea
              value={tabs[active]?.content ?? ""}
              onChange={(e) => updateTab(active, { content: e.target.value })}
              rows={10}
              style={inputStyle}
            />
          </div>
        </section>

        {/* RIGHT: output code + actions (now below, because stacked) */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Output</h2>
            <button onClick={() => navigator.clipboard?.writeText(output)} style={btn}>
              Copy
            </button>
            <button onClick={downloadHtml} style={btn}>
              Download
            </button>
          </div>

          <div
            style={{
              ...box,
              maxHeight: 480,
              overflow: "auto",
              overflowX: "auto",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              whiteSpace: "pre",
              maxWidth: "100%",
            }}
          >
            {output}
          </div>
        </section>
      </div>
    </main>
  );
}
