const faker = require('faker');
const pool = require('../utils/pool');
const bcrypt = require('bcryptjs');

module.exports = async function seedDB() {
  async function makeFakeUser(fakeName, fakePassword) {
    try {
      const fakePasswordHash = await bcrypt.hash(
        fakePassword,
        Number(process.env.SALT_ROUNDS)
      );

      await pool.query(
        `
    INSERT into users 
    (username, password_hash)
    VALUES ($1, $2);`,
        [fakeName, fakePasswordHash]
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function makeFakeNote() {
    const fakeUserId = Math.ceil(Math.random() * 5);
    const fakeTitle = faker.lorem.words();
    const fakeBody = faker.lorem.paragraphs();

    const fakeTags = [];
    const length = Math.floor(Math.random() * 5);
    for (let i = 0; i < length; i++) {
      fakeTags[i] = faker.lorem.word();
      const { rows } = await pool.query(
        `INSERT into tags
        (tag_text)
        VALUES ($1)
        RETURNING *`,
        [fakeTags[i]]
      );

      const fakeTagId = rows[0].id;

      await pool.query(
        `INSERT into users_tags
        (tag_id, notetaker_id)
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
      [
        fakeUserId,
        fakeTitle,
        fakeBody,
        fakeTags,
        fakeFavorite,
        fakeDateModified,
      ]
    );
  }

  const fakeNames = ['John', 'Paul', 'George', 'Ringo', 'Yoko'];
  const fakePasswords = [
    'lennon12345',
    'mccartney12345',
    'harrison12345',
    'starr12345',
    'ono12345',
  ];

  for (let i = 0; i < fakeNames.length; i++) {
    await makeFakeUser(fakeNames[i], fakePasswords[i]);
  }

  for (let i = 0; i < 40; i++) {
    await makeFakeNote();
  }
};
