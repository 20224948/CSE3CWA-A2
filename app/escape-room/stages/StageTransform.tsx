'use client';
import { useState } from 'react';

type Props = { onComplete: () => void; onNext?: () => void };

export default function StageTransform({ onComplete, onNext }: Props) {
  const [input] = useState('[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]');
  const [code, setCode] = useState(`function convert(jsonStr){
  const arr = JSON.parse(jsonStr);
  if(!Array.isArray(arr) || arr.length===0) return "";
  const headers = Object.keys(arr[0]);
  const rows = arr.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","));
  return [headers.join(","), ...rows].join("\\n");
}`);
  const [out, setOut] = useState('');
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function run() {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${code}; return typeof convert==='function' ? convert : null;`);
      const convert = fn();
      if (!convert) throw new Error('convert(jsonStr) is not defined');
      const csv = convert(input);
      setOut(csv);
      const pass = !!csv && csv.startsWith('id,name') && csv.includes('Alice') && csv.includes('Bob');
      setOk(pass);
      setMsg(pass ? '✔ Converted correctly.' : '✖ CSV incorrect. Expect header id,name and both rows.');
      if (pass) onComplete();
    } catch (e: any) {
      setOut('');
      setOk(false);
      setMsg('✖ Error: ' + (e?.message ?? String(e)));
    }
  }

  return (
    <div>
      <h3>Write code to port data from JSON to CSV</h3>
      <p><strong>Input JSON:</strong> <code>{input}</code></p>
      <textarea
        rows={10}
        style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: 8, background:'var(--panel)', color:'var(--text)' }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className="btn-row" style={{ marginTop: 8 }}>
        <button className="btn primary" onClick={run}>Run &amp; Check</button>
        {ok && onNext && <button className="btn" onClick={onNext}>Next Stage →</button>}
      </div>
      {out && (
        <pre style={{ marginTop: 8, border: '1px solid var(--border)', padding: 8, whiteSpace: 'pre-wrap', background:'var(--panel)' }}>
          {out}
        </pre>
      )}
      {msg && <p style={{ color: msg.startsWith('✔') ? 'green' : '#b00020' }}>{msg}</p>}
    </div>
  );
}
