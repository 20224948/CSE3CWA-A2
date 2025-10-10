'use client';
import { useState } from 'react';

type Props = { hotspotClicked: boolean; onComplete: () => void; onNext?: () => void };

export default function StageDebug({ hotspotClicked, onComplete, onNext }: Props) {
  const [done, setDone] = useState(false);

  function acknowledge() {
    if (!hotspotClicked) return;
    setDone(true);
    onComplete();
  }

  return (
    <div>
      <h3>Click Image that Allows You to Debug</h3>
      <p>Find and click the hidden hotspot on the background image above, then confirm below.</p>
      <div className="btn-row">
        <button className="btn primary" disabled={!hotspotClicked} onClick={acknowledge}>
          I found the hotspot
        </button>
        {done && onNext && <button className="btn" onClick={onNext}>Next Stage →</button>}
      </div>
      {!hotspotClicked && <p style={{ color: '#b00020' }}>Hotspot not clicked yet.</p>}
      {done && <p style={{ color: 'green' }}>✔ Debug hotspot confirmed.</p>}
    </div>
  );
}
