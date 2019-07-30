const { Model } = require('objection');

module.exports = class User extends Model {
  static get tableName() {
    return 'campaigns';
  }
};
