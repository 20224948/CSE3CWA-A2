import type { Metadata } from "next";
import Nav from "./components/Nav";
import Breadcrumb from "./components/Breadcrumb";

export const metadata: Metadata = {
  title: "CSE3CWA - Assignment 1",
  description: "Assignment 1 for CSE3CWA, created by Mark Prado (20224948).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
        <style>{`
          :root { color-scheme: light dark; }
          a { color: inherit; text-decoration: underline; }
          header, footer { background: transparent; }
        `}</style>

        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
          }}
        >
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

          {/* Menu (sets/reads cookie for navigation) */}
          <Nav />
        </header>

        <Breadcrumb />

        <main style={{ padding: 16 }}>{children}</main>

        <footer
          style={{
            padding: 16,
            borderTop: "1px solid #ddd",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Mark Prado • Student: 20224948 • {new Date().toLocaleDateString()}
        </footer>
      </body>
    </html>
  );
}
