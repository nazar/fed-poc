const _ = require('lodash');
const DataLoader = require('dataloader');

const Campaign = require('./models/campaign');

module.exports = function(options = {}) {
  return {
    campaignsById: new DataLoader(ids => modelIdFetcher(Campaign, ids), options),
  };
};

// implementation

function modelIdFetcher(Model, ids, idKey = 'id') {
  return Model
    .query()
    .whereIn(idKey, _.uniq(ids))
    .then((rows) => {
      const store = _.keyBy(rows, idKey);
      return _.map(ids, id => store[id]);
    });
}
