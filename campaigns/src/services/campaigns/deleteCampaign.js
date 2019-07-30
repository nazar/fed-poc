const _ = require('lodash');

const Campaign = require('../../models/campaign');


module.exports = function({ id }) {
  return Campaign
    .query()
    .findById(id)
    .then(campaign => {
      if (campaign) {
        return Campaign
          .query()
          .delete()
          .where({ id })
          .returning('*')
          .first();
      } else {
        throw new Error(`Campaign ${id} does not exist`)
      }
    });
};
