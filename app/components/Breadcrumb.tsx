"use client";
import { usePathname } from "next/navigation";

/** Optional overrides for nicer names */
const LABELS: Record<string, string> = {
  "coding-races": "Coding Races",
  "escape-room": "Escape Room",
  "court-room": "Court Room",
};

function pretty(seg: string) {
  // decode spaces etc., strip query-ish bits (safety)
  const decoded = decodeURIComponent(seg).replace(/[?#].*$/, "");
  // handle dynamic values that might still have brackets (rare)
  const cleaned = decoded.replace(/^\[(.+)\]$/, "$1");
  // title case "my-seg-name" => "My Seg Name"
  return LABELS[seg] ?? cleaned
    .split("-")
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Breadcrumb() {
  const pathname = usePathname();          // e.g. "/games/escape-room/level-1"
  // split; remove empty; drop route groups "(...)" and helper folders starting with "_"
  const parts = pathname
    .split("/")
    .filter(Boolean)
    .filter(seg => !(seg.startsWith("(") && seg.endsWith(")")) && !seg.startsWith("_"));

  // Build progressive hrefs: /games, /games/escape-room, ...
  const crumbs = parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/"));

  return (
    <nav aria-label="Breadcrumb" style={{ fontSize: 14, margin: "8px 16px" }}>
      <a href="/">Home</a>
      {crumbs.map((href, i) => {
        const isLast = i === crumbs.length - 1;
        const seg = parts[i];
        return (
          <span key={href}>
            {" "}›{" "}
            {isLast
              ? <span aria-current="page">{pretty(seg)}</span>
              : <a href={href}>{pretty(seg)}</a>}
          </span>
        );
      })}
    </nav>
  );
}
