const { Router } = require('express');
const NotesService = require('../services/NotesService');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/new', ensureAuth, async (req, res, next) => {
    try {
      const note = await NotesService.create(req.body);
      res.send(note);
    } catch (err) {
      next(err);
    }
  })
  .put('/edit/:id', ensureAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedNote = await NotesService.update({ id, ...req.body });
      res.send(updatedNote);
    } catch (err) {
      next(err);
    }
  })
  .delete('/delete/:id', ensureAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedNote = await NotesService.delete(id);
      res.send(deletedNote);
    } catch (err) {
      next(err);
    }
  })
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const searchResults = await NotesService.search(req.body);
      res.send(searchResults);
    } catch (err) {
      next(err);
    }
  });
