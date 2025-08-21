import type { Metadata } from "next";
import Link from "next/link";
import Nav from "./components/Nav";
import Breadcrumb from "./components/Breadcrumb";
import ThemeSwitch from "./components/ThemeSwitch";

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

                {/* Theme + header + drawer styles */}
                <style>{`
          :root { color-scheme: light dark; }
          a { color: inherit; text-decoration: underline; }

          html[data-theme="light"] {
            --bg:#ffffff; --text:#111111; --panel:#ffffff; --muted:#f5f7fa;
            --border:#cfd6df; --accent:#2563eb; --button-bg:#ffffff; --button-text:#111111;
          }
          html[data-theme="dark"] {
            --bg:#0b0f14; --text:#e8edf2; --panel:#0f151d; --muted:#0b1118;
            --border:#2a3441; --accent:#7aa2ff; --button-bg:#131a23; --button-text:#e8edf2;
          }
          
          html[data-theme="earth"] {
            --bg:     #f6f2ea;
            --text:   #2b2b2b;
            --panel:  #efe8d8;
            --muted:  #e7decd;
            --border: #c8bfae;
            --accent: #8b5e34;
            --button-bg:   #f6f2ea;
            --button-text: #2b2b2b;
        }


          body { background: var(--bg); color: var(--text); }
          header, footer { background: transparent; }
          .surface { border-color: currentColor; opacity: 0.95; }

          /* visibility helpers */
          .desktop-only { display: none; }
          .mobile-only  { display: inline-flex; }
          @media (min-width: 768px) {
            .desktop-only { display: block; }
            .mobile-only  { display: none !important; } /* ensure hamburger is hidden on desktop */
          }

          /* === CSS-only hamburger drawer === */
          #nav-toggle { position: fixed; opacity: 0; pointer-events: none; } /* hidden checkbox */

          .overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.35);
            opacity: 0; pointer-events: none; transition: opacity .2s ease;
            z-index: 1000;
          }
          .drawer {
            position: fixed; top: 0; left: 0; height: 100dvh; width: 280px;
            background: var(--panel); color: var(--text);
            transform: translateX(-100%); transition: transform .2s ease;
            box-shadow: 2px 0 12px rgba(0,0,0,.3);
            display: flex; flex-direction: column;
            z-index: 1001;
          }
          #nav-toggle:checked ~ .overlay { opacity: 1; pointer-events: auto; }
          #nav-toggle:checked ~ .drawer  { transform: translateX(0); }

          .hamburger-btn, .close-btn {
            background: var(--button-bg); color: var(--button-text);
            border: 1px solid var(--border); border-radius: 8px;
            padding: 6px 10px; cursor: pointer; font-size: 18px; line-height: 1;
          }
          /* NOTE: no display set here; .mobile-only controls visibility */
          .hamburger-btn { align-items: center; gap: 8px; }
          .close-btn { border: none; background: transparent; font-size: 22px; margin: 8px; align-self: flex-end; }

          .nav-list { list-style: none; margin: 0; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
          .nav-link {
            display: block; padding: 10px 12px; border: 1px solid var(--border);
            border-radius: 10px; text-decoration: none; background: var(--muted); color: var(--text);
          }
          .nav-link:hover { outline: 2px solid var(--accent); outline-offset: 2px; }
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
                    {/* Mobile hamburger trigger */}
                    <label htmlFor="nav-toggle" className="hamburger-btn mobile-only" aria-label="Open menu">
                        ☰ <span style={{ fontSize: 14 }}>Menu</span>
                    </label>

                    {/* Desktop navigation only */}
                    <div className="desktop-only">
                        <Nav />
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Theme switch on far right */}
                    <ThemeSwitch />
                </header>

                {/* Hidden checkbox drives the drawer */}
                <input id="nav-toggle" type="checkbox" aria-hidden="true" />

                {/* Mobile overlay + drawer */}
                <label htmlFor="nav-toggle" className="overlay mobile-only" aria-label="Close menu" />
                <aside className="drawer mobile-only" aria-label="Main navigation">
                    <label htmlFor="nav-toggle" className="close-btn" aria-label="Close menu">×</label>
                    <nav>
                        <ul className="nav-list">
                            <li><Link href="/" className="nav-link">Home</Link></li>
                            <li><Link href="/about" className="nav-link">About</Link></li>
                            <li><Link href="/escape-room" className="nav-link">Escape Room</Link></li>
                            <li><Link href="/coding-races" className="nav-link">Coding Races</Link></li>
                            <li><Link href="/court-room" className="nav-link">Court Room</Link></li>
                        </ul>
                    </nav>
                </aside>

                {/* CLOSE DRAWER AFTER CLICKING A MENU LINK */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
      (function () {
        function closeDrawerIfLinkClick(evt) {
          var link = evt.target && evt.target.closest('.drawer a');
          if (!link) return;
          var cb = document.getElementById('nav-toggle');
          if (cb && 'checked' in cb) cb.checked = false;
        }
        document.addEventListener('click', closeDrawerIfLinkClick, true);
      })();
    `,
                    }}
                />

                {/* Breadcrumbs */}
                <Breadcrumb />


                {/* Main content */}
                <main style={{ padding: 16 }}>{children}</main>

                {/* Footer */}
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
