const pool = require('../utils/pool');

module.exports = class Tag {
  constructor(row) {
    this.id = row.id;
    this.text = row.tag_text;
  }

  static async getByUserId(userId) {
    const { rows } = await pool.query(
      `
        SELECT tag_text FROM tags
        INNER JOIN users_tags
        ON users_tags.tag_id=tags.id
        INNER JOIN users
        ON users.id=users_tags.notetaker_id
        WHERE users.id=$1;
      `,
      [userId]
    );

    return rows.map((row) => row.tag_text);
  }
};
