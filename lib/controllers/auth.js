const { Router } = require('express');
const UserService = require('../services/UserService');
const ensureAuth = require('../middleware/ensure-auth');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.cookie('session', user.authToken(), {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: ONE_DAY_IN_MS,
      });
      res.send(user.toJSON());
    } catch (err) {
      if (err.message === 'Username already in use') {
        err.status = 400;
      }
      next(err);
    }
  })
  .post('/signin', async (req, res, next) => {
    try {
      const user = await UserService.authorize(req.body);
      res.cookie('session', user.authToken(), {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: ONE_DAY_IN_MS,
      });
      res.send(user.toJSON());
    } catch (err) {
      err.status = 401;
      next(err);
    }
  })
  .post('/verifygithub', async (req, res, next) => {
    try {
      const user = await UserService.createGitHubUser(req.body.code);

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 86400000,
      });

      res.send(user);
    } catch (error) {
      next(error);
    }
  })
  .get('/me', ensureAuth, async (req, res, next) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      next(error);
    }
  });
