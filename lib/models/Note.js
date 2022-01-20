const pool = require('../utils/pool');
const Tag = require('./Tag');

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

    const userTags = await Tag.getByUserId(userId);

    const filteredTags = tags.filter(
      (tag) => !userTags.map((t) => t.text).includes(tag)
    );

    await Promise.all(
      filteredTags.map((tag) =>
        Tag.create({ notetakerId: userId, tagText: tag })
      )
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

    const userTags = await Tag.getByUserId(userId);

    const filteredTags = tags.filter(
      (tag) => !userTags.map((t) => t.text).includes(tag)
    );

    await Promise.all(
      filteredTags.map((tag) =>
        Tag.create({ notetakerId: userId, tagText: tag })
      )
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
