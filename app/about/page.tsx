// app/about/page.tsx
export default function About() {
  return (
    <main>
      <h1>About</h1>

      <section aria-label="Student details" style={{ marginBlock: 12 }}>
        <p><strong>Website Created By:</strong> Mark Prado<strong> Student Number:</strong> 20224948</p>
      </section>

      {/* Placeholder video block — replace with real video later*/}
      <section aria-label="Tutorial video" style={{ marginBlock: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Tutorial video</h2>
        <div
          style={{
            border: "1px dashed #aaa",
            padding: 12,
            borderRadius: 8,
            background: "transparent",
          }}
        >
          <p style={{ margin: 0 }}>
            Video placeholder — add <code>/public/intro.mp4</code> and use the
            {' '}<code>&lt;video&gt;</code>{' '}tag, or embed a YouTube iframe here.
          </p>
          {/* 
          Video Placeholder
          */}
        </div>
      </section>
    </main>
  );
}
