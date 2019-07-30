const _ = require('lodash');

const Campaign = require('../../models/campaign');


module.exports = function() {
  return Campaign.query();
};
