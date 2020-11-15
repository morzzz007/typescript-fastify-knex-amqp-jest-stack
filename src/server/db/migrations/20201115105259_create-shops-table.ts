import * as Knex from 'knex';

const up = async function (knex: Knex): Promise<void> {
  return knex.schema.createTable('shops', function (table) {
    table.increments('id').primary();
    table.string('hostname');
    table.integer('customer_id');
    table.string('token');
    table.timestamps(false, true);
  });
};

const down = async function (knex: Knex): Promise<void> {
  return knex.schema.dropTable('shops');
};

export { up, down };
