const Note = require('../models/Note');

module.exports = class NotesService {
  static async create(newNote) {
    const result = await Note.insert(newNote);
    return result;
  }

  static async update(updatedNote) {
    const result = await Note.update(updatedNote);
    return result;
  }

  static async delete(noteId) {
    const result = await Note.delete(noteId);
    return result;
  }

  static async search({ userId, query }) {
    const result = await Note.search(userId);

    const tags = query.tags;
    let filteredNotes;

    if (query.type === 'tags') {
      filteredNotes = result.filter((note) => {
        for (let i = 0; i < tags.length; i++) {
          if (!note.tags.includes(tags[i])) return false;
        }
        return true;
      });
    }
    if (query.type === 'favorite') {
      filteredNotes = result.filter((note) => {
        return note.favorite === true;
      });
    }
    return filteredNotes;
  }
};
