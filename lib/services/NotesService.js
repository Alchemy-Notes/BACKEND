const Note = require('../models/Note');

module.exports = class NotesService {
  static async create(newNote) {
    const result = await Note.insert(newNote);
    return result;
  }
};
