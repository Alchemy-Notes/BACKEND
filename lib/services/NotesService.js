const Note = require('../models/Note');

//names could be a bit clearer in some of these
module.exports = class NotesService {
  static async create(newNote) {
    const createdNote = await Note.insert(newNote);
    return createdNote;
  }

  static async update(updatesToNote) {
    const updatedNote = await Note.update(updatesToNote);
    return updatedNote;
  }

  static async delete(noteId) {
    const deletedNote = await Note.delete(noteId);
    return deletedNote;
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
