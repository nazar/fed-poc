exports.up = function(knex) {
  return knex.schema.createTable('offers', (table) => {
    table.increments().primary();

    table.integer('campaign_id').unsigned().notNullable();
    table.foreign('campaign_id').references('campaigns.id');

    table.text('name').unique().notNullable();
    table.boolean('closed').defaultTo(false);

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('offers');
};
