// app/about/page.tsx
export default function About() {
  return (
    <main>
      <h1>About</h1>

      <section aria-label="Student details" style={{ marginBlock: 12 }}>
        <p>
          <strong>Website Created By:</strong> Mark Prado
          <strong> Student Number:</strong> 20224948
        </p>
      </section>

      <section aria-label="Tutorial video" style={{ marginBlock: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Tutorial video</h2>
        <video
          src="/Demo.mp4"
          width="600"
          controls
          style={{
            borderRadius: 8,
            display: "block",
            marginTop: 12,
          }}
        >
          Your browser does not support the video tag.
        </video>
      </section>
    </main>
  );
}
