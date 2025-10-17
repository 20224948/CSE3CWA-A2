import { GET as getOutputById } from '../app/api/outputs/[id]/route';
import { sequelize } from '../lib/sequelize';
import { lastCreatedId } from './api.saveRun.test';

const LABEL = 'getRun';

// Pretty banners without console.log headers
const start = () =>
  process.stdout.write(`\n\x1b[36m[${LABEL}] ── START ───────────────────────────────\x1b[0m\n`);
const end = () =>
  process.stdout.write(`\x1b[36m[${LABEL}] ── END ─────────────────────────────────\x1b[0m\n`);

describe('API /api/outputs/:id (GET)', () => {
  beforeAll(async () => {
    await sequelize.sync(); // no force here
  });

  it('retrieves the run saved from the previous test', async () => {
    if (!lastCreatedId) throw new Error('No run ID from save test');

    const res = await getOutputById(
      new Request(`http://localhost/api/outputs/${lastCreatedId}`),
      { params: { id: String(lastCreatedId) } } as any
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.id).toBe(lastCreatedId);
    expect(json.title).toMatch(/Test Run - Save/i);
    expect(json.data).toEqual(expect.objectContaining({ stage: 'debug' }));
  });
});
