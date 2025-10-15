'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Timer from './Timer';
import EscapeCanvas from './EscapeCanvas';
import StageFormat from './stages/StageFormat';
import StageDebug from './stages/StageDebug';
import StageNumbers from './stages/StageNumbers';
import StageTransform from './stages/StageTransform';

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
  const [mins, setMins] = useState(10);

  const [active, setActive] = useState<StageKey>('format');
  const [completed, setCompleted] = useState<Record<StageKey, boolean>>({
    format: false,
    debug: false,
    numbers: false,
    transform: false,
  });
  const [hotspotClicked, setHotspotClicked] = useState(false);

  // timer / expiry
  const [timeUp, setTimeUp] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // force Timer remount on restart

  // NEW: remember the last saved run id
  const [lastSavedId, setLastSavedId] = useState<number | null>(null);

  const canNext = useMemo(() => completed[active], [completed, active]);
  const allDone = useMemo(() => Object.values(completed).every(Boolean), [completed]);

  function markDone(stage: StageKey) {
    if (completed[stage]) return;
    setCompleted((prev) => ({ ...prev, [stage]: true }));
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
    setTimerKey((k) => k + 1); // restart timer
  }

  async function saveRun() {
    const snapshot = {
      activeStage: active,
      completed,
      minutes: mins,
      timeUp,
      hotspotClicked,
      savedAt: new Date().toISOString(),
    };

    // Generate a small HTML summary too
    const statusList = Object.entries(snapshot.completed)
      .map(([key, done]) => `<li>${done ? '✔' : '✖'} ${key}</li>`)
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

    const payload = {
      title: `Run @ ${new Date().toLocaleString()}`,
      html,
      data: snapshot,
    };

    try {
      const res = await fetch('/api/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      const saved = await res.json();            // <- get { id, ... } back
      setLastSavedId(saved.id as number);        // <- remember it for UI
      alert(`Run saved successfully! (Run #${saved.id})`);
    } catch (err: any) {
      alert(err.message || 'Failed to save run.');
    }
  }

  async function loadLatestRun() {
    try {
      const res = await fetch('/api/outputs', { cache: 'no-store' });
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const list: any[] = await res.json();
      if (!list.length) return alert('No saved runs yet.');
      const latest = list[0];

      // Prefer structured JSON
      const data = latest.data;
      if (data) {
        setActive(data.activeStage ?? 'format');
        setCompleted(data.completed ?? { format: false, debug: false, numbers: false, transform: false });
        setMins(data.minutes ?? 10);
        setTimeUp(!!data.timeUp);
        setHotspotClicked(!!data.hotspotClicked);
        setLastSavedId(latest.id ?? null);
        alert(`Loaded run #${latest.id}`);
        return;
      }

      // Fallback: parse from <pre>…</pre> in html (older saves)
      const m = /<pre>([\s\S]*)<\/pre>/.exec(latest.html || '');
      if (m) {
        const parsed = JSON.parse(m[1]);
        setActive(parsed.activeStage ?? 'format');
        setCompleted(parsed.completed ?? { format: false, debug: false, numbers: false, transform: false });
        setMins(parsed.minutes ?? 10);
        setTimeUp(!!parsed.timeUp);
        setHotspotClicked(!!parsed.hotspotClicked);
        setLastSavedId(latest.id ?? null);
        alert(`Loaded run #${latest.id} (from HTML)`);
        return;
      }

      alert('Saved run has no data to load.');
    } catch (e: any) {
      alert(e.message || 'Load failed');
    }
  }

  async function loadRunById(id: number) {
    try {
      const res = await fetch(`/api/outputs/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`GET id failed: ${res.status}`);
      const row = await res.json();
      const data = row.data;
      if (data) {
        setActive(data.activeStage ?? 'format');
        setCompleted(data.completed ?? { format: false, debug: false, numbers: false, transform: false });
        setMins(data.minutes ?? 10);
        setTimeUp(!!data.timeUp);
        setHotspotClicked(!!data.hotspotClicked);
        setLastSavedId(row.id ?? null);
        alert(`Loaded run #${row.id}`);
        return;
      }
      const m = /<pre>([\s\S]*)<\/pre>/.exec(row.html || '');
      if (m) {
        const parsed = JSON.parse(m[1]);
        setActive(parsed.activeStage ?? 'format');
        setCompleted(parsed.completed ?? { format: false, debug: false, numbers: false, transform: false });
        setMins(parsed.minutes ?? 10);
        setTimeUp(!!parsed.timeUp);
        setHotspotClicked(!!parsed.hotspotClicked);
        setLastSavedId(row.id ?? null);
        alert(`Loaded run #${row.id} (from HTML)`);
        return;
      }
      alert('Saved run has no data to load.');
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
        isActive={active === 'debug'} // 👈 only clickable on debug stage
        onHotspot={() => {
          if (timeUp) return;
          setHotspotClicked(true);
        }}
      />

      <hr className="section-divider" />

      {/* Controls row */}
      <section className="grid gap-3">
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Timer (min):
            <input
              type="number"
              min={1}
              max={60}
              value={mins}
              onChange={(e) => setMins(+e.target.value)}
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
            onExpire={() => setTimeUp(true)}
            warnAt={15}
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

          {/* NEW: show last saved id */}
          {lastSavedId && (
            <span style={{ opacity: 0.85 }}>
              Last saved: <b>Run #{lastSavedId}</b>{' '}
              <a className="btn" href={`/api/outputs/${lastSavedId}`} target="_blank" rel="noreferrer">
                View JSON
              </a>
            </span>
          )}
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
        {/* Interaction blocker when time is up */}
        {timeUp && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 12,
              background: 'transparent',
              pointerEvents: 'auto',
            }}
          />
        )}

        {active === 'format' && (
          <StageFormat onComplete={() => markDone('format')} onNext={nextStage} />
        )}
        {active === 'debug' && (
          <StageDebug
            hotspotClicked={hotspotClicked}
            onComplete={() => markDone('debug')}
            onNext={nextStage}
          />
        )}
        {active === 'numbers' && (
          <StageNumbers onComplete={() => markDone('numbers')} onNext={nextStage} />
        )}
        {active === 'transform' && (
          <StageTransform onComplete={() => markDone('transform')} />
        )}
      </section>

      <hr className="section-divider" />

      {/* Time up OR Unlock bar */}
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
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
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
            <div className="flex flex-wrap items-center justify-between gap-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' } as any}>
              <strong>🔓 Exit unlocked!</strong>
              <div className="btn-row">
                <button className="btn" onClick={playAgain}>Play Again</button>
                <Link className="btn" href="/">Exit to Menu</Link>
              </div>
            </div>
          ) : (
            <div>
              <strong>Locked</strong> — complete all stages to unlock the exit.
            </div>
          )}
        </section>
      )}

      <hr className="section-divider" />

      {/* Survey */}
      <section>
        <h3 style={{ marginTop: 0 }}>Feedback</h3>
        <p>
          Please complete the ethics survey:{' '}
          <a
            className="btn"
            href="https://redcap.latrobe.edu.au/redcap/surveys/?s=PPEKFTMPXF4KKEFY"
            target="_blank"
          >
            Open Survey
          </a>
        </p>
      </section>
    </main>
  );
}
