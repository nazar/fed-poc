exports.up = function(knex) {
  return knex.schema.createTable('campaigns', (table) => {
    // this id columns isn't an auto-increment field in match-db and is campaigns.id instead
    table.integer('id').unique();

    table.string('ws_number');
    table.string('datorama_campaign_name');
    table.boolean('user_share').defaultTo(false);

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('campaigns');
};
