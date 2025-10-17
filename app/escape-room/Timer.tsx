'use client';
import { useEffect, useState } from 'react';

export default function Timer({
  minutes,
  onExpire,
  warnAt = 15,                 // keep your original API
  onTick,
  initialSeconds,              // ✅ new (seconds)
}: {
  minutes: number;
  onExpire: () => void;
  warnAt?: number;
  onTick?: (remaining: number) => void;
  initialSeconds?: number;     // ✅ new
}) {
  // seed from initialSeconds if provided, else minutes*60
  const [secondsLeft, setSecondsLeft] = useState(
    Number.isFinite(initialSeconds as number)
      ? Math.floor(initialSeconds as number)
      : minutes * 60
  );

  // ✅ when minutes or initialSeconds change, reset the timer state
  useEffect(() => {
    const start = Number.isFinite(initialSeconds as number)
      ? Math.floor(initialSeconds as number)
      : minutes * 60;
    setSecondsLeft(start);
  }, [minutes, initialSeconds]);

  // tick
  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, onExpire, onTick]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const warn = mins < warnAt / 60;   // ⬅️ unchanged from your version

  return (
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 8,
        background: warn ? '#ffbaba' : 'var(--panel)',
        color: warn ? '#5a0000' : 'var(--text)',
      }}
    >
      ⏱ {mins}:{secs.toString().padStart(2, '0')}
    </span>
  );
}
