import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id', { primaryKey: true });
  });

  await knex.schema.createTable('discord_connections', (table) => {
    table.string('id').primary();
    table.uuid('user_id').unique();

    table.foreign('user_id').references('users.id');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('discord_connections');
  await knex.schema.dropTable('users');
}

