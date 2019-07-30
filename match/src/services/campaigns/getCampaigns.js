const _ = require('lodash');

const Campaign = require('../../models/campaign');


module.exports = function({ filter }) {
  return _.tap(Campaign.query(), query => {
    const hasOrders = _.get(filter, 'hasOrders');

    if (hasOrders) {
      query.join('offers', { 'campaigns.id': 'offers.campaignId' })
    }
  })
};
