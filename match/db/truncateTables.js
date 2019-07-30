const _ = require('lodash');
const Bluebird = require('bluebird');

const dataSpec = require('./fixtures');
const knex = require('./knex');

module.exports = function truncateTables(...tables) {
  const spec = _.isEmpty(tables) ? dataSpec : _.pick(dataSpec, tables);
  const tablesToDelete = _.keys(spec);

  return Bluebird.each(tablesToDelete, table =>
    knex.raw(`TRUNCATE TABLE ${table} cascade`)
  );
};
