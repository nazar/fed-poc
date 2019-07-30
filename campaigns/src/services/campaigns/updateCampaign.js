const _ = require('lodash');

const Campaign = require('../../models/campaign');


module.exports = function({ id, input }) {
  return Campaign
    .query()
    .patch(input)
    .where({ id })
    .returning('*')
    .first()
};
