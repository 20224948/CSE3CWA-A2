"use client";
import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "earth";
const COOKIE_NAME = "theme";
const MODES: Mode[] = ["light", "dark", "earth"];

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; path=/; expires=" +
    d.toUTCString();
}
function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : "";
}

export default function ThemeSwitch() {
  const [mode, setMode] = useState<Mode>("light");

  // hydrate from <html data-theme> or cookie
  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Mode) ||
      (getCookie(COOKIE_NAME) as Mode) ||
      "light";
    setMode(current);
  }, []);

  function setTheme(next: Mode) {
    setMode(next);
    setCookie(COOKIE_NAME, next);
    document.documentElement.setAttribute("data-theme", next);
  }

  function cycleTheme() {
    const i = MODES.indexOf(mode);
    const next = MODES[(i + 1) % MODES.length];
    setTheme(next);
  }

  // small visual hint for earth mode
  const label =
    mode === "light" ? "Light" : mode === "dark" ? "Dark" : "Earth";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label="Change theme"
      title={`Theme: ${label} (click to change)`}
      style={{
        marginLeft: "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        padding: "6px 10px",
        border: "1px solid var(--border)",
        borderRadius: 8,
        background: "var(--button-bg)",
        color: "var(--button-text)",
        font: "inherit",
      }}
    >
      <span style={{ fontWeight: 600 }}>{label}</span>
      {/* simple indicator */}
      <span
        aria-hidden="true"
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "1px solid var(--border)",
          background:
            mode === "light"
              ? "#fff"
              : mode === "dark"
              ? "#0b0f14"
              : "#cbbf9d" /* matches your earth palette */,
        }}
      />
    </button>
  );
}
