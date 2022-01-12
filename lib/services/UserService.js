const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { exchangeCodeForToken, getUserInfo } = require('../utils/github');

module.exports = class UserService {
  static async create({ username, password }) {
    const userExists = await User.findByUsername(username);

    if (userExists) {
      throw new Error('username already in use');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      username,
      passwordHash,
    });

    return user;
  }

  static async authorize({ username, password }) {
    const user = await User.findByUsername(username);

    if (!user) {
      throw new Error('Invalid username/password combination');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new Error('Invalid username/password combination');
    }

    return user;
  }

  static async createGitHubUser(code) {
    const accessToken = await exchangeCodeForToken(code);
    const userInfo = await getUserInfo(accessToken);
    let user = await User.findByUsername(userInfo.login);

    if (!user) {
      user = await User.insert({
        username: userInfo.login,
      });
    }
    return user;
  }
};
