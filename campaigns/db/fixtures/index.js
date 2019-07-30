const _ = require('lodash');

const { importSanitizer } = require('./utils');

const campaigns = importSanitizer(require('./campaigns'));

module.exports = _.merge(
  {},
  campaigns
);
