import { POST as postOutputs } from '../app/api/outputs/route';
import { GET as getOutputById } from '../app/api/outputs/[id]/route';
import { sequelize } from '../lib/sequelize';

describe('API /api/outputs/:id (GET)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it('creates and retrieves a saved run by ID', async () => {
    // Create record first
    const payload = {
      title: 'Test Run - Retrieve',
      html: '<h1>Saved Run</h1>',
      data: { stage: 'numbers', minutes: 12 },
    };

    const postRes = await postOutputs(
      new Request('http://localhost/api/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    );
    const created = await postRes.json();
    expect(created.id).toBeDefined();

    // Fetch by ID
    const getRes = await getOutputById(
      new Request(`http://localhost/api/outputs/${created.id}`),
      { params: { id: String(created.id) } }
    );

    expect(getRes.status).toBe(200);
    const fetched = await getRes.json();

    // Validate returned record
    expect(fetched.id).toBe(created.id);
    expect(fetched.title).toBe(payload.title);
    expect(fetched.data).toEqual(expect.objectContaining({ stage: 'numbers' }));
  });
});
