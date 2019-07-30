const { Model } = require('objection');

module.exports = class Campaign extends Model {
  static get tableName() {
    return 'campaigns';
  }
};
