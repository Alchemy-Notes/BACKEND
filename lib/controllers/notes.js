const { Router } = require('express');
const NotesService = require('../services/NotesService');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/new', async (req, res, next) => {
    try {
      const note = await NotesService.create(req.body);
      res.send(note);
    } catch (err) {
      next(err);
    }
  })
  .put('/edit/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedNote = await NotesService.update({ id, ...req.body });
      res.send(updatedNote);
    } catch (err) {
      next(err);
    }
  });
