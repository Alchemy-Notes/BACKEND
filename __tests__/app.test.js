require('dotenv').config();

const { execSync } = require('child_process');
const { contentType } = require('express/lib/response');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const User = require('../lib/models/User');
const UserService = require('../lib/services/UserService');

describe('app routes', () => {
  describe('routes', () => {
    beforeAll(async () => {
      execSync('npm run setup-db');

      await client.connect();
    });
    afterAll((done) => client.end(done));

    const fakeUser = { username: 'lunac', password: 'rainmakerpup' };

    test('It should signup a user without oauth', async () => {
      const signInData = await fakeRequest(app)
        .post('/api/auth/signup')
        .expect('Content-Type', /json/)
        .send({ username: 'NegaRingo', password: 'starr12345' });

      expect(signInData.body).toEqual({
        username: 'NegaRingo',
        id: '6',
      });
    });

    test('should allow user to signin with correct credentials', async () => {
      const response = await fakeRequest(app)
        .post('/api/auth/signin')
        .expect('Content-Type', /json/)
        .send({ username: 'NegaRingo', password: 'starr12345' });

      expect(response.body).toEqual({
        id: '6',
        username: 'NegaRingo',
      });
    });

    //_______________end of test________________//
  }, 10000);
});
