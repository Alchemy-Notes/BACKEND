const pool = require('../lib/utils/pool');
const setup = require('../data/setup.js');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('Auth Routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  test('It should signup a user without oauth', async () => {
    const signInData = await fakeRequest(app)
      .post('/api/auth/signup')
      .expect('Content-Type', /json/)
      .send({ username: 'MisterRingo', password: 'starr12345' });

    expect(signInData.body).toEqual({
      username: 'MisterRingo',
      id: expect.any(String),
    });
  });

  test('should allow user to signin with correct credentials', async () => {
    const user = await UserService.create({
      username: 'MisterRingo',
      password: 'starr12345',
    });
    const response = await fakeRequest(app)
      .post('/api/auth/signin')
      .expect('Content-Type', /json/)
      .send({ username: 'MisterRingo', password: 'starr12345' });

    expect(response.body).toEqual({
      id: user.id,
      username: 'MisterRingo',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
