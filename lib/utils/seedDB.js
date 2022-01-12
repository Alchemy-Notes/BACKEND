const faker = require('faker');
const pool = require('../utils/pool');

async function makeFakeUser() {
  const fakeUsername = faker.name.firstName() + faker.name.lastName();
  const fakePasswordHash = faker.random.alphaNumeric();

  await pool.query(
    `
  INSERT into users 
  (username, password_hash)
  VALUES ($1, $2);`,
    [fakeUsername, fakePasswordHash]
  );
}

async function makeFakeNote() {
  const fakeUserId = Math.floor(Math.random() * 5);
  const fakeTitle = faker.lorem.words();
  const fakeBody = faker.lorem.paragraphs();

  const fakeTags = [];
  const length = Math.floor(Math.random() * 5);
  for (let i = 0; i < length; i++) {
    fakeTags[i] = faker.lorem.word();
    const { rows } = await pool.query(
      `INSERT into tags
      (text)
      VALUES ($1);
      RETURNING *`,
      [fakeTags[i]]
    );

    const fakeTagId = rows[0].id;

    await pool.query(
      `INSERT into users_tags
      (tag_id, user_id)
      VALUES ($1, $2);
      `,
      [fakeTagId, fakeUserId]
    );
  }

  const fakeFavorite = Math.floor(Math.random() * 10) === 1 ? true : false;
  const fakeDateModified = faker.date.past();

  await pool.query(
    `INSERT into notes
    (user_id, title, body, tags, favorite, date_modified)
    VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [fakeUserId, fakeTitle, fakeBody, fakeTags, fakeFavorite, fakeDateModified]
  );
}

for (let i = 0; i < 5; i++) {
  makeFakeUser();
}

for (let i = 0; i < 40; i++) {
  makeFakeNote();
}
