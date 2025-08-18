"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const COOKIE_KEY = "lastMenu";

function setCookie(name: string, value: string, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}
function getCookie(name: string) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : "";
}

export default function Nav() {
  const pathname = usePathname();
  const [last, setLast] = useState<string>("");

  useEffect(() => {
    // save current path as last visited
    setCookie(COOKIE_KEY, pathname);
    // read last for optional UI
    setLast(getCookie(COOKIE_KEY));
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/escape-room", label: "Escape Room" },
    { href: "/coding-races", label: "Coding Races" },
    { href: "/court-room", label: "Court Room" },
  ];

  return (
    <nav aria-label="Main" style={{ display: "flex", gap: 12 }}>
      {links.map((l) => {
        const active = pathname === l.href;
        const lastVisited = !active && last === l.href;
        return (
          <a
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            style={{
              textDecoration: active ? "none" : "underline",
              fontWeight: active ? 700 : 400,
              borderBottom: active ? "2px solid currentColor" : "2px solid transparent",
              paddingBottom: 2,
              opacity: lastVisited ? 0.85 : 1,
            }}
            title={lastVisited ? "Last visited" : undefined}
          >
            {l.label}
          </a>
        );
      })}
    </nav>
  );
}
