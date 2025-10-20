'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Timer from './Timer';
import EscapeCanvas from './EscapeCanvas';
import StageFormat from './stages/StageFormat';
import StageDebug from './stages/StageDebug';
import StageNumbers from './stages/StageNumbers';
import StageTransform from './stages/StageTransform';
import { flushSync } from 'react-dom';

type StageKey = 'format' | 'debug' | 'numbers' | 'transform';

const ORDER: StageKey[] = ['format', 'debug', 'numbers', 'transform'];
const STAGES: { key: StageKey; label: string }[] = [
  { key: 'format', label: 'Format Code Correctly' },
  { key: 'debug', label: 'Click Image to Debug' },
  { key: 'numbers', label: 'Generate 0–1000' },
  { key: 'transform', label: 'Port Data Format (JSON→CSV)' },
];

export default function EscapeRoom() {
  const [bg] = useState('/escape-room.jpg');

  // --- Timer state ---
  const [mins, setMins] = useState(10);
  const [timeUp, setTimeUp] = useState(false);
  const [timerKey, setTimerKey] = useState(0);        // force Timer remount
  const [remainingSec, setRemainingSec] = useState(mins * 60);

  // --- Stage state ---
  const [active, setActive] = useState<StageKey>('format');
  const [completed, setCompleted] = useState<Record<StageKey, boolean>>({
    format: false,
    debug: false,
    numbers: false,
    transform: false,
  });
  const [hotspotClicked, setHotspotClicked] = useState(false);

  // --- UI helper ---
  const [lastSavedId, setLastSavedId] = useState<number | null>(null);

  // Make the View JSON button appear even in headless runs
  useEffect(() => {
    const persisted = typeof window !== 'undefined'
      ? window.localStorage.getItem('lastSavedRunId')
      : null;
    if (persisted) setLastSavedId(Number(persisted));
  }, []);

  const canNext = useMemo(() => completed[active], [completed, active]);
  const allDone = useMemo(() => Object.values(completed).every(Boolean), [completed]);

  function markDone(stage: StageKey) {
    if (!completed[stage]) setCompleted((p) => ({ ...p, [stage]: true }));
  }

  function nextStage() {
    const idx = ORDER.indexOf(active);
    for (let i = idx + 1; i < ORDER.length; i++) {
      if (!completed[ORDER[i]]) {
        setActive(ORDER[i]);
        return;
      }
    }
  }

  function playAgain() {
    setCompleted({ format: false, debug: false, numbers: false, transform: false });
    setActive('format');
    setHotspotClicked(false);
    setTimeUp(false);
    setMins(10);
    setTimerKey((k) => k + 1);
  }

  // ---------- SAVE ----------
  async function saveRun() {
    const snapshot = {
      activeStage: active,
      completed,
      minutes: mins,
      remainingSec,
      timeUp,
      hotspotClicked,
      savedAt: new Date().toISOString(),
    };

    const statusList = Object.entries(snapshot.completed)
      .map(([k, done]) => `<li>${done ? '✔' : '✖'} ${k}</li>`)
      .join('');

    const html = `
<!doctype html>
<html lang="en">
<meta charset="utf-8"/>
<title>Escape Room Snapshot</title>
<body style="font-family:system-ui;padding:16px">
  <h1>Escape Room – Snapshot</h1>
  <p><b>Active stage:</b> ${snapshot.activeStage}</p>
  <ul>${statusList}</ul>
  <p><em>Saved at ${new Date().toLocaleString()}</em></p>
</body>
</html>`.trim();

    try {
      const res = await fetch('/api/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Run @ ${new Date().toLocaleString()}`, html, data: snapshot }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      const saved = await res.json();

      // ✅ persist id so "View JSON" survives refresh
      if (saved?.id) {
        setLastSavedId(saved.id as number);
        try { localStorage.setItem('lastSavedRunId', String(saved.id)); } catch { }
      }

      // tiny delay so the UI paints the link before alert blocks the thread
      await new Promise(r => setTimeout(r, 50));

      alert(`Run saved successfully! (Run #${saved.id})`);
    } catch (e: any) {
      alert(e.message || 'Failed to save run.');
    }
  }


  // ---------- LOAD HELPERS ----------
  function restoreFromSaved(saved: any) {
    const savedMinutes = Number(saved?.minutes);
    const savedRemaining = Number(saved?.remainingSec);

    const restoredMins =
      Number.isFinite(savedMinutes) && savedMinutes > 0 ? savedMinutes : 10;

    const nextRemaining =
      Number.isFinite(savedRemaining) && savedRemaining > 0
        ? Math.floor(savedRemaining)
        : restoredMins * 60;

    // Set non-timer states
    flushSync(() => {
      setActive(saved?.activeStage ?? 'format');
      setCompleted(saved?.completed ?? { format: false, debug: false, numbers: false, transform: false });
      setHotspotClicked(!!saved?.hotspotClicked);
      setMins(restoredMins);
      setRemainingSec(nextRemaining); // <- must be committed before remount
      setTimeUp(false);
    });

    // Remount Timer AFTER remainingSec is committed
    flushSync(() => {
      setTimerKey((k) => k + 1);
    });
  }


  function extractSaved(row: any) {
    if (row?.data) return row.data;
    if (typeof row?.html === 'string') {
      const m = /<pre>([\s\S]*)<\/pre>/.exec(row.html);
      if (m) try { return JSON.parse(m[1]); } catch { }
    }
    return undefined;
  }

  // ---------- LOAD LATEST ----------
  async function loadLatestRun() {
    try {
      const res = await fetch('/api/outputs', { cache: 'no-store' });
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const list: any[] = await res.json();
      if (!list.length) return alert('No saved runs yet.');
      const latest = list[0];
      const saved = extractSaved(latest);
      if (!saved) return alert('Saved run has no data to load.');

      restoreFromSaved(saved);

      // ✅ remember this id for refreshes
      setLastSavedId(latest.id);
      try { localStorage.setItem('lastSavedRunId', String(latest.id)); } catch { }

      // if you want an alert, keep it async so paint happens first
      // setTimeout(() => alert(`Loaded run #${latest.id}`), 0);
    } catch (e: any) {
      alert(e.message || 'Load failed');
    }
  }

  // ---------- LOAD BY ID ----------
  async function loadRunById(id: number) {
    try {
      const res = await fetch(`/api/outputs/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`GET id failed: ${res.status}`);
      const row = await res.json();
      const saved = extractSaved(row);
      if (!saved) return alert('Saved run has no data to load.');

      restoreFromSaved(saved);

      // ✅ remember this id for refreshes
      setLastSavedId(row.id);
      try { localStorage.setItem('lastSavedRunId', String(row.id)); } catch { }

      // setTimeout(() => alert(`Loaded run #${row.id}`), 0);
    } catch (e: any) {
      alert(e.message || 'Load failed');
    }
  }


  return (
    <main className="grid gap-5 md:gap-6 text-neutral-800 dark:text-neutral-100">
      <h1 className="text-3xl font-bold">Escape Room</h1>

      {/* Background */}
      <EscapeCanvas
        backgroundUrl={bg}
        isActive={active === 'debug'}
        onHotspot={() => {
          if (!timeUp) setHotspotClicked(true);
        }}
      />

      <hr className="section-divider" />

      {/* Controls */}
      <section className="grid gap-3">
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Timer (min):
            <input
              type="number"
              min={1}
              max={60}
              value={mins}
              onChange={(e) => {
                const v = Math.max(1, Math.min(60, Number(e.target.value) || 0));
                setMins(v);
                setTimeUp(false);
                setRemainingSec(v * 60);   // ← keep seconds in sync with the edited minutes
                setTimerKey((k) => k + 1); // ← force the Timer to re-seed from initialSeconds
              }}

              style={{
                width: 80,
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--panel)',
                color: 'var(--text)',
              }}
              disabled={timeUp}
            />
          </label>

          <Timer
            key={timerKey}
            minutes={mins}
            initialSeconds={remainingSec}
            warnAt={1}
            onExpire={() => setTimeUp(true)}
            onTick={(r) => setRemainingSec(r)}
          />

          <select
            value={active}
            onChange={(e) => setActive(e.target.value as StageKey)}
            aria-label="Select puzzle stage"
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--panel)',
              color: 'var(--text)',
            }}
            disabled={timeUp}
          >
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {completed[s.key] ? `✔ ${s.label}` : s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="btn-row" style={{ alignItems: 'center', gap: 12 }}>
          <button className="btn primary" onClick={saveRun} disabled={timeUp}>
            Save Run
          </button>
          <button className="btn" onClick={loadLatestRun}>
            Load Latest Run
          </button>
          <span style={{ opacity: 0.85 }}>
            {lastSavedId ? (
              <>
                Current: <b>Run #{lastSavedId}</b>{' '}
                <a
                  className="btn"
                  href={`/api/outputs/${lastSavedId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View JSON
                </a>
              </>
            ) : (
              <>
                Last saved: <b>–</b>{' '}
                <button className="btn" disabled title="No saved runs yet">
                  View JSON
                </button>
              </>
            )}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" min={1} placeholder="Run ID" id="runIdInput" style={{ width: 90, padding: '6px 8px' }} />
          <button
            className="btn"
            onClick={() => {
              const el = document.getElementById('runIdInput') as HTMLInputElement | null;
              const id = el ? Number(el.value) : NaN;
              if (!id) return alert('Enter a valid ID');
              loadRunById(id);
            }}
          >
            Load by ID
          </button>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Stage panel */}
      <section
        style={{
          position: 'relative',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 16,
          background: 'var(--panel)',
          opacity: timeUp ? 0.6 : 1,
        }}
      >
        {timeUp && <div style={{ position: 'absolute', inset: 0, borderRadius: 12 }} />}

        {active === 'format' && <StageFormat onComplete={() => markDone('format')} onNext={nextStage} />}
        {active === 'debug' && (
          <StageDebug
            hotspotClicked={hotspotClicked}
            onComplete={() => markDone('debug')}
            onNext={nextStage}
          />
        )}
        {active === 'numbers' && <StageNumbers onComplete={() => markDone('numbers')} onNext={nextStage} />}
        {active === 'transform' && <StageTransform onComplete={() => markDone('transform')} />}
      </section>

      <hr className="section-divider" />

      {/* Footer */}
      {timeUp ? (
        <section
          aria-live="polite"
          style={{
            padding: 12,
            borderRadius: 12,
            background: 'var(--danger-bg, #2a1214)',
            border: '1px solid var(--danger-border, #7f1d1d)',
            color: 'var(--danger-text, #fca5a5)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <strong>⏰ Time’s up!</strong>
            <div className="btn-row">
              <button className="btn" onClick={playAgain}>Play Again</button>
              <Link className="btn" href="/">Exit to Menu</Link>
            </div>
          </div>
        </section>
      ) : (
        <section
          aria-live="polite"
          style={{
            padding: 12,
            borderRadius: 12,
            background: allDone ? 'var(--success-bg, #e8f7ea)' : 'var(--muted)',
            border: `1px solid ${allDone ? 'var(--success-border, #b7e0bf)' : 'var(--border)'}`,
            color: allDone ? 'var(--success-text, #16481b)' : 'var(--text)',
          }}
        >
          {allDone ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <strong>🔓 Exit unlocked!</strong>
              <div className="btn-row">
                <button className="btn" onClick={playAgain}>Play Again</button>
                <Link className="btn" href="/">Exit to Menu</Link>
              </div>
            </div>
          ) : (
            <div><strong>Locked</strong> — complete all stages to unlock the exit.</div>
          )}
        </section>
      )}

    </main>
  );
}
