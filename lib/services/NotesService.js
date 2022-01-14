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
};
