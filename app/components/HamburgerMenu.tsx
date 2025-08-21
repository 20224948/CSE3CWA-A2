'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = { href: string; label: string };

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const items: Item[] = [
    { href: '/',            label: 'Home' },
    { href: '/about',       label: 'About' },
    { href: '/escape-room', label: 'Escape Room' },
    { href: '/coding-races',label: 'Coding Races' },
    { href: '/court-room',  label: 'Court Room' },
  ];

  const go = (href: string) => {
    // close first, then navigate (next tick)
    setOpen(false);
    setTimeout(() => router.push(href), 0);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}
      >
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000,
          }}
        >
          {/* Drawer */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed', top: 0, left: 0, height: '100%', width: 260,
              background: 'var(--panel)', color: 'var(--text)', padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '2px 0 12px rgba(0,0,0,.3)',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}
            >
              ×
            </button>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((it) => (
                <button
                  key={it.href}
                  onClick={() => go(it.href)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    background: 'var(--muted)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                >
                  {it.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
