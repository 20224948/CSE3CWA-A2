import type { Metadata } from "next";
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
                {/* Set theme ASAP from localStorage (NO system fallback) */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function(){
  try{
    var m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
    var t = m ? decodeURIComponent(m[1]) : 'light';  // default
    document.documentElement.setAttribute('data-theme', t);
  }catch(e){}
})();`,
                    }}
                />
                {/* Theme styles */}
                <style>{`
          :root { color-scheme: light dark; }
          a { color: inherit; text-decoration: underline; }
          html[data-theme="light"] body { background:#ffffff; color:#111111; }
          html[data-theme="dark"]  body { background:#111111; color:#eeeeee; }
          header, footer { background: transparent; }
          .surface { border-color: currentColor; opacity: 0.95; }
        `}</style>

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

                    <Nav />

                    {/* Switch sits on the right */}
                    <ThemeSwitch />
                </header>

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
