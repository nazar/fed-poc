const _ = require('lodash');

const Campaign = require('../../models/campaign');


module.exports = function({ input }) {
  return Campaign
    .query()
    .insert(input)
    .returning('*')
};
