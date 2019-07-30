const { Model } = require('objection');

module.exports = class Offer extends Model {
  static get tableName() {
    return 'offers';
  }
};
