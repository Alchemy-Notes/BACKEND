const fakeRequest = require('supertest');
const { execSync } = require('child_process');
const auth = require('../lib/middleware/ensure-auth');
jest.mock('../lib/middleware/ensure-auth', () => jest.fn());
const app = require('../lib/app');

describe('Tags Routes', () => {
  beforeAll(() => {
    execSync('npm run setup-db');
    auth.mockImplementation((req, res, next) => next());
  });

  test('get all of a users tags', async () => {
    const response = await fakeRequest(app)
      .get('/api/tags/1')
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({
      id: expect.any(String),
      tags: expect.arrayContaining([expect.any(String)]),
    });
  });
});
