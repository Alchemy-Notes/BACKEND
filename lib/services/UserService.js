const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { exchangeCodeForToken, getUserInfo } = require('../utils/github');

module.exports = class UserService {
  static async create({ email, password }) {
    const userExists = await User.findByEmail(email);

    if (userExists) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash,
    });

    return user;
  }

  static async authorize({ email, password }) {
    const user = await User.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email/password combination');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new Error('Invalid email/password combination');
    }

    return user;
  }

  static async createGitHubUser(code) {
    const accessToken = await exchangeCodeForToken(code);
    const userInfo = await getUserInfo(accessToken);
    let user = await User.findByEmail(userInfo.login);

    if (!user) {
      user = await User.insert({
        email: userInfo.login,
      });
    }
    return user;
  }
};
