const { Router } = require('express');
const UserService = require('../services/UserService');
const ensureAuth = require('../middleware/ensure-auth');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create({
        ...req.body,
      });
      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      });
      res.send(user.toJSON());
    } catch (err) {
      if (err.message === 'Email already in use') {
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
        maxAge: ONE_DAY_IN_MS,
      });
      res.send(user.toJSON());
    } catch (err) {
      err.status = 401;
      next(err);
    }
  })
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URL}&scopes=user:email`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const { user, userInfo } = await UserService.createGitHubUser(
        req.query.code
      );

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: 86400000,
        secure: true,
      });

      res.send({ user, userInfo });
    } catch (error) {
      next(error);
    }
  })
  .get('/verify', ensureAuth, (req, res, next) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      next(error);
    }
  });
