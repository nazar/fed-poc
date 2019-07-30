const _ = require('lodash');
const { knexSnakeCaseMappers } = require('objection');

const logger = require('./logger');

const knex = require('knex')({
  client: 'pg',
  connection: 'postgresql://postgres:docker@db-match:5432/match',
  ...knexSnakeCaseMappers()
});

module.exports = knex;

const times = {};

knex
  .on('query', (query) => {
    const uid = query.__knexQueryUid;
    times[uid] = {
      startTime: Date.now()
    };
  })
  .on('query-error', (error, query) => {
    const bindings = _(query.bindings)
      .map((b) => {
        return _.isObject(b) ? JSON.stringify(b) : b;
      })
      .join(',');

    logger.sql(query.sql, `- [${bindings}]`);
  })
  .on('query-response', (response, query) => {
    const uid = query.__knexQueryUid;

    const { startTime } = times[uid];
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    const bindings = _(query.bindings)
      .map(b => (_.isObject(b) ? JSON.stringify(b) : b))
      .join(',');

    logger.sql(query.sql, `- [${bindings}] - ${(response || []).length} rows - ${elapsedTime.toFixed(3)} ms`);

    delete times[uid];
  });
