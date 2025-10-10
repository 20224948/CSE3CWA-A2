import type { Metadata } from "next";
import Breadcrumb from "./components/Breadcrumb";
import ThemeSwitch from "./components/ThemeSwitch";
import HamburgerMenu from "./components/HamburgerMenu";

export const metadata: Metadata = {
  title: "CSE3CWA – Assignment 1",
  description: "Assignment 1 for CSE3CWA, created by Mark Prado (20224948).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
        {/* Set theme ASAP from cookie */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try{
    var m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
    var t = m ? decodeURIComponent(m[1]) : 'light';
    document.documentElement.setAttribute('data-theme', t);
  }catch(e){}
})();`,
          }}
        />

        {/* Global theme + layout + shared component styles */}
        <style>{`
          :root { color-scheme: light dark; }
          a { color: inherit; text-decoration: underline; }

          *, *::before, *::after { box-sizing: border-box; }
          html, body { max-width: 100%; overflow-x: hidden; }
          header, main, footer { max-width: 100%; overflow-x: hidden; }
          img, svg, video, canvas { max-width: 100%; height: auto; }
          pre { max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }

          html[data-theme="light"] {
            --bg:#ffffff; --text:#111111; --panel:#ffffff; --muted:#f5f7fa;
            --border:#cfd6df; --accent:#2563eb; --button-bg:#ffffff; --button-text:#111111;
            --success-bg:#e8f7ea; --success-border:#b7e0bf; --success-text:#16481b;
            --danger-bg:#fdecec;  --danger-border:#f5b3b3; --danger-text:#7f1d1d;
          }
          html[data-theme="dark"] {
            --bg:#0b0f14; --text:#e8edf2; --panel:#0f151d; --muted:#0b1118;
            --border:#2a3441; --accent:#7aa2ff; --button-bg:#131a23; --button-text:#e8edf2;
            --success-bg:#122619; --success-border:#1e3a26; --success-text:#c0f5c7;
            --danger-bg:#2a1214;  --danger-border:#7f1d1d; --danger-text:#fca5a5;
          }
          html[data-theme="earth"] {
            --bg:#f6f2ea; --text:#2b2b2b; --panel:#efe8d8; --muted:#e7decd;
            --border:#c8bfae; --accent:#8b5e34; --button-bg:#f6f2ea; --button-text:#2b2b2b;
            --success-bg:#e1efdd; --success-border:#b7cfb1; --success-text:#304a2f;
            --danger-bg:#f0e2df;  --danger-border:#d1b1ac; --danger-text:#5c2b25;
          }

          body { background: var(--bg); color: var(--text); }
          header, footer { background: transparent; }
          .surface { border-color: currentColor; opacity: 0.95; }

          /* Two-up layout helper */
          .two-up { display: grid; grid-template-columns: 1fr; gap: 16px; }
          @media (min-width: 980px) {
            .two-up { grid-template-columns: 1fr 1fr; align-items: start; }
          }
          .two-up .output { overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }

          /* Shared buttons and section dividers */
          .btn {
            display: inline-flex; align-items: center; justify-content: center;
            gap: 8px; padding: 10px 14px; border-radius: 10px;
            border: 1px solid var(--border); background: var(--button-bg);
            color: var(--button-text); text-decoration: none; cursor: pointer;
            font-size: 14px; line-height: 1.2;
            transition: transform .02s ease, background .15s ease, border-color .15s ease;
          }
          .btn:hover { border-color: var(--accent); }
          .btn:active { transform: translateY(1px); }
          .btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
          .btn.ghost { background: transparent; }
          .btn-row { display: flex; flex-wrap: wrap; gap: 12px; }
          .section-divider { border: 0; border-top: 1px solid var(--border); margin: 12px 0; }

          /* Active nav link (used by HamburgerMenu buttons via aria-current) */
          .nav-link[aria-current="page"] {
            background: rgba(255,255,255,0.08);
            outline: 2px solid var(--accent);
            outline-offset: 2px;
          }
          .nav-link:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
          }
            /* Hamburger trigger: high-contrast across themes */
          .hamburger-trigger{
            background: var(--button-bg);
            color: var(--button-text);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 8px 12px;
            cursor: pointer;
            line-height: 1;
            font-size: 18px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 1px 0 rgba(0,0,0,.05);
          }
          .hamburger-trigger:hover{ border-color: var(--accent); }
          .hamburger-trigger:focus-visible{
            outline: 2px solid var(--accent);
            outline-offset: 2px;
          }
          .hamburger-trigger svg{ display:block; width:20px; height:20px; }
        `}</style>

        {/* Header */}
        <header
          className="surface"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 16px",
            borderBottom: "1px solid",
          }}
        >
          {/* Single hamburger (no desktop Nav cluster) */}
          <HamburgerMenu />
          <div style={{ flex: 1 }} />
          <ThemeSwitch />
        </header>

        {/* Breadcrumbs + main content */}
        <Breadcrumb />
        <main style={{ padding: 16 }}>{children}</main>

        <footer
          className="surface"
          style={{
            padding: 16,
            borderTop: "1px solid",
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
