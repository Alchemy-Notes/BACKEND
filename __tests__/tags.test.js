const fakeRequest = require('supertest');
const app = require('../lib/app');

describe('Tags Routes', () => {
  test('get all of a users tags', async () => {
    const fakeUserId = 1;

    const response = await fakeRequest(app)
      .get('/api/tags/1')
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({
      id: fakeUserId,
      tags: expect.arrayContaining([expect.any(String)]),
    });
  });
});
