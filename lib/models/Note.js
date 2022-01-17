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

  static async update({
    id,
    body,
    title,
    tags,
    favorite,
    dateModified,
    userId,
  }) {
    const { rows } = await pool.query(
      `
        UPDATE notes 
        SET 
          user_id = $1, 
          title = $2, 
          body = $3, 
          tags = $4, 
          favorite = $5, 
          date_modified = $6 
          WHERE id = $7
          RETURNING *;
      `,
      [userId, title, body, tags, favorite, dateModified, id]
    );
    return new Note({ ...rows[0] });
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
        DELETE FROM notes
        WHERE id=$1
        RETURNING *;
      `,
      [id]
    );
    return new Note({ ...rows[0] });
  }

  static async search(userId) {
    const { rows } = await pool.query(
      `
    SELECT * FROM notes WHERE user_id=$1;`,
      [userId]
    );
    return rows.map((row) => new Note(row));
  }
};
