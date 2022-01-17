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

  static async create({ notetakerId, tagText }) {
    let tagId;
    let rowsResult;
    const { tag } = await pool.query(
      `
    SELECT * from tags WHERE tag_text=$1;`,
      [tagText]
    );

    if (!tag[0]) {
      const { rows } = await pool.query(
        `INSERT into tags
        (tag_text)
        VALUES ($1)
        returning*;
        `,
        [tagText]
      );
      tagId = rows[0].id;
      rowsResult = rows;
    } else {
      tagId = tag[0].id;
    }

    await pool.query(
      `INSERT into users_tags
      (tag_id, notetaker_id)
      VALUES ($1, $2)
      RETURNING *`,
      [tagId, notetakerId]
    );

    if (rowsResult) {
      return new Tag(rowsResult[0]);
    } else {
      return new Tag(tag[0]);
    }
  }
};
