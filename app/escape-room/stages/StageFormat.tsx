'use client';
import { useMemo, useState } from 'react';

type Props = { onComplete: () => void; onNext?: () => void };

const messy = `function  add( a , b ){return a+b}`;
const target = `function add(a, b) {
  return a + b;
}`;

function normalize(s: string) {
  return s
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\{\s*/g, ' { ')
    .replace(/\s*\}\s*/g, ' } ')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

export default function StageFormat({ onComplete, onNext }: Props) {
  const [code, setCode] = useState(target);
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const normalizedTarget = useMemo(() => normalize(target), []);

  function check() {
    const pass = normalize(code) === normalizedTarget;
    setOk(pass);
    setMsg(pass ? '✔ Correctly formatted.' : '✖ Not formatted to the required style yet.');
    if (pass) onComplete();
  }

  const codeBoxStyle: React.CSSProperties = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    background: 'var(--code-bg, var(--panel))',
    color: 'var(--text)',
    border: '1px solid var(--code-border, var(--border))',
    borderRadius: 8,
    padding: 10,
    whiteSpace: 'pre-wrap',
  };

  return (
    <div>
      <h3>Format Code Correctly</h3>
      <p>Goal: Reformat the messy function below to the target style.</p>

      <div style={{ display: 'grid', gap: 10 }}>
        <div>
          <strong>Messy code (reference):</strong>
          <pre style={codeBoxStyle}>{messy}</pre>
        </div>

        <div>
          <strong>Your formatted code:</strong>
          <textarea
            rows={7}
            style={{ ...codeBoxStyle, width: '100%', resize: 'vertical' }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="btn-row">
          <button className="btn primary" onClick={check}>Validate</button>
          {ok && onNext && <button className="btn" onClick={onNext}>Next Stage →</button>}
        </div>

        {msg && (
          <p style={{ color: msg.startsWith('✔') ? 'var(--success-text)' : 'var(--danger-text)' }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
