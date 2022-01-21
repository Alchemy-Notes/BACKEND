const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.passwordHash = row.password_hash;
  }

  static async insert({ username, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users
      (username, password_hash)
      VALUES ($1, $2)
      RETURNING *;`,
      [username, passwordHash]
    );

    return new User({ ...rows[0] });
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `SELECT * FROM users
      WHERE username=$1;`,
      [username]
    );

    if (!rows[0]) return null;
    return new User({ ...rows[0] });
  }

  static async getMe(userId) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id =$1', [
      userId,
    ]);

    return new User(rows[0]);
  }

  authToken() {
    return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
      expiresIn: '24h',
    });
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
    };
  }
};
