"use client";
import { usePathname } from "next/navigation";

function pretty(label: string) {
  return label
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Breadcrumb() {
  const pathname = usePathname(); // e.g. "/coding-races"
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" style={{ fontSize: 14, margin: "8px 16px" }}>
      <a href="/">Home</a>
      {parts.map((part, i) => {
        const href = "/" + parts.slice(0, i + 1).join("/");
        return (
          <span key={href}>
            {" "}
            &gt;{" "}
            {i < parts.length - 1 ? <a href={href}>{pretty(part)}</a> : <span aria-current="page">{pretty(part)}</span>}
          </span>
        );
      })}
    </nav>
  );
}
