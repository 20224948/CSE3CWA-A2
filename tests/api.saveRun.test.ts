import { POST as postOutputs } from '../app/api/outputs/route';
import { sequelize } from '../lib/sequelize';

const LABEL = 'saveRun';
let lastCreatedId: number | null = null;

const start = () =>
  process.stdout.write(`\n\x1b[33m[${LABEL}] ── START ───────────────────────────────\x1b[0m\n`);
const end = () =>
  process.stdout.write(`\x1b[33m[${LABEL}] ── END ─────────────────────────────────\x1b[0m\n`);

describe('API /api/outputs (POST)', () => {
  beforeAll(async () => {
    // fresh DB for deterministic IDs
    await sequelize.sync({ force: true });
  });

  it('saves a new escape room run successfully', async () => {
    const payload = {
      title: 'Test Run - Save',
      html: '<h1>Escape Room Snapshot</h1>',
      data: { stage: 'debug', minutes: 8, completed: true },
    };

    const res = await postOutputs(
      new Request('http://localhost/api/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    );

    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.title).toBe(payload.title);
    expect(json.data).toEqual(expect.objectContaining({ stage: 'debug' }));

    // expose id to the GET test
    lastCreatedId = json.id;
  });
});

// 👇 export for reuse
export { lastCreatedId };
