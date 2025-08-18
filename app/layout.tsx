// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSE3CWA - Assignment 1",
  description: "Assignment scaffold with student number and navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
        {/* Header with student ID + navigation */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* Student number badge */}
          <div
            style={{
              fontWeight: 700,
              border: "1px solid #888",
              borderRadius: 6,
              padding: "4px 8px",
            }}
          >
            20224948
          </div>

          <nav aria-label="Main" style={{ display: "flex", gap: 12 }}>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/escape-room">Escape Room</a>
            <a href="/coding-races">Coding Races</a>
            <a href="/court-room">Court Room</a>
          </nav>
        </header>

        {/* Page content */}
        <main style={{ padding: 16 }}>{children}</main>

        {/* Footer with your ID */}
        <footer
          style={{
            padding: 16,
            borderTop: "1px solid #ddd",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Mark Prado • Student: 20224948 •{" "}
          {new Date().toLocaleDateString()}
        </footer>
      </body>
    </html>
  );
}
