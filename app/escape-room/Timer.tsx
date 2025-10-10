'use client';
import { useEffect, useRef, useState } from 'react';

export default function Timer({
  minutes,
  onExpire,
  warnAt = 15, // seconds left to start warning color
}: {
  minutes: number;
  onExpire?: () => void;
  warnAt?: number;
}) {
  const [left, setLeft] = useState(minutes * 60);
  const expiredRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  // reset when minutes change
  useEffect(() => {
    setLeft(minutes * 60);
    expiredRef.current = false;
  }, [minutes]);

  // tick
  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = window.setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  // call onExpire AFTER state has updated to 0 (avoids setState-during-render error)
  useEffect(() => {
    if (left === 0 && !expiredRef.current) {
      expiredRef.current = true;
      // microtask ensures it runs after current render
      Promise.resolve().then(() => onExpire?.());
    }
  }, [left, onExpire]);

  const mm = Math.floor(left / 60).toString().padStart(2, '0');
  const ss = (left % 60).toString().padStart(2, '0');
  const isWarn = left > 0 && left <= warnAt;

  return (
    <span
      aria-live="polite"
      style={{
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--panel)',
        color: isWarn ? 'var(--danger-text, #7f1d1d)' : 'var(--text)',
        boxShadow: isWarn ? '0 0 0 2px rgba(220,38,38,.15) inset' : 'none',
      }}
      title={left === 0 ? 'Time is up' : 'Time remaining'}
    >
      ⏱ {mm}:{ss}
    </span>
  );
}
