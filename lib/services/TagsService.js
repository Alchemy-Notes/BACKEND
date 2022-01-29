const Tag = require('../models/Tag');

module.exports = class TagsService {
  static async getByUserId(userId) {
    const userTags = await Tag.getByUserId(userId);
    return userTags;
  }

  static async create(newTag) {
    const createdTag = await Tag.create(newTag);
    return createdTag;
  }
};
