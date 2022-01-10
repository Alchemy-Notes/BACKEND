const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.passwordHash = row.password_hash;
  }
};
