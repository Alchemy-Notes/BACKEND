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

  static async search(tags) {
    const result = await Note.search(tags);
    return result;
  }
};
