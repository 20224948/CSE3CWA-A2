'use client';
import { useState } from 'react';

type Props = { onComplete: () => void; onNext?: () => void };

/**
 * Students must define function gen() that returns [0..1000].
 */
export default function StageNumbers({ onComplete, onNext }: Props) {
  const [code, setCode] = useState(`function gen(){
  const out = [];
  for (let i=0;i<=1000;i++) out.push(i);
  return out;
}`);
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function run() {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${code}; return typeof gen==='function' ? gen() : null;`);
      const res = fn();
      const pass =
        Array.isArray(res) && res.length === 1001 && res[0] === 0 && res[1000] === 1000;
      setOk(pass);
      setMsg(pass ? '✔ Correct output.' : '✖ Incorrect output. Make sure it returns [0..1000].');
      if (pass) onComplete();
    } catch (e: any) {
      setOk(false);
      setMsg('✖ Error: ' + (e?.message ?? String(e)));
    }
  }

  return (
    <div>
      <h3>Write code to generate all numbers between 0 and 1000 (inclusive)</h3>
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
      {msg && <p style={{ color: msg.startsWith('✔') ? 'green' : '#b00020' }}>{msg}</p>}
    </div>
  );
}
