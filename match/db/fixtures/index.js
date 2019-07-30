const _ = require('lodash');

const { importSanitizer } = require('./utils');

const campaigns = importSanitizer(require('./campaigns'));
const offers = importSanitizer(require('./offers'), [
  'campaign_id'
]);

module.exports = _.merge(
  {},
  campaigns,
  offers
);
