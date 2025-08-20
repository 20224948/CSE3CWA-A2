"use client";
import { useEffect, useState } from "react";

type Mode = "light" | "dark";
const COOKIE_NAME = "theme";

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days*24*60*60*1000);
  document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; expires=" + d.toUTCString();
}
function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : "";
}

export default function ThemeSwitch() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Mode) || (getCookie(COOKIE_NAME) as Mode) || "light";
    setMode(current);
  }, []);

  function setTheme(next: Mode) {
    setMode(next);
    setCookie(COOKIE_NAME, next);
    document.documentElement.dataset.theme = next;
  }

  const isDark = mode === "dark";

  return (
    <label
      aria-label="Toggle dark mode"
      style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}
    >
      <span aria-hidden="true">{isDark ? "Dark" : "Light"}</span>
      <input
        type="checkbox"
        role="switch"
        aria-checked={isDark}
        checked={isDark}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />
      <span aria-hidden="true" style={{ width: 52, height: 28, borderRadius: 999, border: "1px solid #888", position: "relative", display: "inline-block" }}>
        <span style={{ position: "absolute", top: 2, left: isDark ? 26 : 2, width: 24, height: 24, borderRadius: "50%", border: "1px solid #888", transition: "left 150ms ease", background: "currentColor" }} />
      </span>
    </label>
  );
}
