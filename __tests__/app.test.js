require('dotenv').config();

const { execSync } = require('child_process');
const { contentType } = require('express/lib/response');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    beforeAll(async () => {
      execSync('npm run setup-db');

      await client.connect();
    });
    afterAll((done) => client.end(done));

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
  }, 10000);
});
