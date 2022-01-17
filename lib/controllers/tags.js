const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const TagsService = require('../services/TagsService');

module.exports = Router()
  .get('/:id', ensureAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      const tags = await TagsService.getByUserId(id);
      res.send({
        id,
        tags,
      });
    } catch (err) {
      next(err);
    }
  })
  .post('/tags', async (req, res, next) => {
    try {
      const tag = await TagsService.create(req.body);
      res.send(tag);
    } catch (err) {
      next(err);
    }
  });
