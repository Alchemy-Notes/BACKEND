const Tag = require('../models/Tag');

module.exports = class TagsService {
  static async getByUserId(userId) {
    const tags = await Tag.getByUserId(userId);
    return tags;
  }
};
