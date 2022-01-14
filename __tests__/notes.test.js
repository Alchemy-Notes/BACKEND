require('dotenv').config();

const { execSync } = require('child_process');
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

    test('notes/new route should create a new note', async () => {
      const response = await fakeRequest(app)
        .post('/api/notes/new')
        .expect('Content-Type', /json/)
        .send({
          body: 'Look at my super duper cool JavaScript note. For loops are the best!',
          title: 'My first note',
          tags: ['JavaScript'],
          favorite: false,
          dateModified: new Date(Date.now()),
          userId: 1,
        });

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          body: 'Look at my super duper cool JavaScript note. For loops are the best!',
          title: 'My first note',
          tags: expect.arrayContaining(['JavaScript']),
          userId: expect.any(String),
          favorite: false,
          dateModified: expect.any(String),
        })
      );
    });
  }, 10000);
});
