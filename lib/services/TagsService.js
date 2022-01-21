const Tag = require('../models/Tag');

module.exports = class TagsService {
  static async getByUserId(userId) {
    const tags = await Tag.getByUserId(userId);
    return tags;
  }

  static async create(newTag) {
    const tag = await Tag.create(newTag);
    return tag;
  }
};
