const pool = require('../utils/pool');

module.exports = class Note {
  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.body = row.body;
    this.favorite = row.favorite;
    this.tags = row.tags;
    this.dateModified = row.date_modified;
    this.userId = row.user_id;
  }

  static async insert({ body, title, tags, favorite, dateModified, userId }) {
    const { rows } = await pool.query(
      `
        INSERT INTO notes
        (user_id, title, body, tags, favorite, date_modified)
        values ($1, $2, $3, $4, $5, $6)
        returning*;
      `,
      [userId, title, body, tags, favorite, dateModified]
    );

    return new Note({ ...rows[0] });
  }
};
