exports.up = function(knex) {
  return knex.schema.createTable('campaigns', (table) => {
    table.increments().primary();

    table.string('name').notNullable();
    table.date('flight_start_date').notNullable();
    table.date('flight_end_date').notNullable();
    table.float('investment').notNullable();

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('campaigns');
};
