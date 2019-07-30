const process = require('process');
const SqlFixtures = require('sql-fixtures');

const dataSpec = require('./fixtures');
const knex = require('./knex');
const truncateTables = require('./truncateTables');

const fixtureCreator = new SqlFixtures(knex);

truncateTables()
  .then(() => fixtureCreator
    .create(dataSpec)
    .then(
      () => {
        process.exit(0);
      },
      (e) => {
        console.log('e', e);
        process.exit(1);
      })
  );


