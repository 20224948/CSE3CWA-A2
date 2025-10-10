'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

type Item = { href: string; label: string };

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const drawerId = 'hamburger-drawer';

  useEffect(() => setMounted(true), []);

  const items: Item[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/escape-room', label: 'Escape Room' },
    { href: '/coding-races', label: 'Coding Races' },
    { href: '/court-room', label: 'Court Room' },
  ];

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => router.push(href), 0);
  };

  // --- Accessibility & behaviour ---
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a,button,[tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      }
    };
    requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])')
        ?.focus();
    });
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on route change + return focus to trigger
  useEffect(() => { if (open) setOpen(false); }, [pathname]);
  useEffect(() => { if (!open) triggerRef.current?.focus(); }, [open]);

  // --- Drawer markup rendered via portal ---
  const overlayAndDrawer = (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 10000,
        }}
      />
      {/* Drawer */}
      <div
        id={drawerId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          width: 260,
          background: 'var(--panel)',
          color: 'var(--text)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '2px 0 16px rgba(0,0,0,.35)',
          zIndex: 10001,
          transform: `translateX(${open ? '0' : '-100%'})`,
          transition: 'transform 180ms ease-out',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            fontSize: 22,
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          ×
        </button>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it) => {
            const active = pathname === it.href || (it.href !== '/' && pathname?.startsWith(it.href));
            return (
              <button
                key={it.href}
                onClick={() => go(it.href)}
                aria-current={active ? 'page' : undefined}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  background: active ? 'rgba(255,255,255,0.08)' : 'var(--muted)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                {it.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* Trigger (☰) — styled separately for contrast */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setOpen(true); }
        }}
        aria-label="Open menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={drawerId}
        style={{
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '8px 12px',
          cursor: 'pointer',
          lineHeight: 1,
          fontSize: 18,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          width="20"
          height="20"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        <span style={{ fontSize: 14 }}>Menu</span>
      </button>

      {/* Drawer rendered outside normal DOM flow to avoid clipping */}
      {mounted && open && createPortal(overlayAndDrawer, document.body)}
    </>
  );
}
