import { POST as postOutputs } from '../app/api/outputs/route';
import { sequelize } from '../lib/sequelize';

describe('API /api/outputs (POST)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // fresh in-memory DB for each run
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
    expect(json.id).toBeDefined();
    expect(json.title).toBe(payload.title);
    expect(json.data).toEqual(expect.objectContaining({ stage: 'debug', completed: true }));
  });
});
