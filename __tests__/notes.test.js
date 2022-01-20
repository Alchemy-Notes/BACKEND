const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const auth = require('../lib/middleware/ensure-auth');
jest.mock('../lib/middleware/ensure-auth', () => jest.fn());
const UserService = require('../lib/services/UserService');

describe('Notes Routes', () => {
  beforeAll(() => {
    execSync('npm run setup-db');
    auth.mockImplementation((req, res, next) => next());
  });

  test('notes/new route should create a new note', async () => {
    const user = await UserService.create({
      username: 'notAFakeUser',
      password: 'notAFakePassword',
    });
    const response = await fakeRequest(app)
      .post('/api/notes/new')
      .expect('Content-Type', /json/)
      .send({
        body: 'Look at my super duper cool JavaScript note. For loops are the best!',
        title: 'My first note',
        tags: ['JavaScript'],
        favorite: false,
        dateModified: new Date(Date.now()),
        userId: user.id,
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

  test('notes/edit/:id should update a note', async () => {
    const res = await fakeRequest(app)
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
    const response = await fakeRequest(app)
      .put('/api/notes/edit/1')
      .expect('Content-Type', /json/)
      .send({
        body: 'look at my super duper cool JavaScript note. For Loops are the best!',
        title: 'My First Note',
        tags: ['JavaScript', 'First', 'For Loops'],
        favorite: false,
        dateModified: new Date(Date.now()),
        userId: res.body.userId,
        id: 1,
      });

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        body: 'look at my super duper cool JavaScript note. For Loops are the best!',
        title: 'My First Note',
        tags: expect.arrayContaining(['JavaScript', 'First', 'For Loops']),
        userId: expect.any(String),
        favorite: false,
        dateModified: expect.any(String),
      })
    );
  });

  test('/notes/delete/:id will delete a note', async () => {
    const res = await fakeRequest(app)
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

    const response = await fakeRequest(app).delete(
      `/api/notes/delete/${res.body.id}`
    );

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

  test('should return notes that meet search criteria', async () => {
    const res = await fakeRequest(app)
      .post('/api/notes')
      .set('Accept', 'application/json')
      .send({
        userId: 1,
        query: { type: 'tags', tags: ['JavaScript', 'React'] },
      });

    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          userId: '1',
          id: expect.any(String),
          title: 'React',
          body: 'React is a JavaScript framework (or library) no one really seems to know.',
          tags: ['JavaScript', 'React'],
          favorite: false,
          dateModified: expect.any(String),
        },
      ])
    );
  });
});
