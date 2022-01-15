const fakeRequest = require('supertest');
const app = require('../lib/app');
const { execSync } = require('child_process');

const UserService = require('../lib/services/UserService');

describe('Auth Routes', () => {
  beforeAll(() => {
    execSync('npm run setup-db');
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
    const response = await fakeRequest(app)
      .post('/api/auth/signin')
      .expect('Content-Type', /json/)
      .send({ username: 'MisterRingo', password: 'starr12345' });

    expect(response.body).toEqual({
      id: expect.any(String),
      username: 'MisterRingo',
    });
  });
});
