import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_roles', (table) => {
    table.uuid('user_id');
    table.string('type');

    table.unique(['user_id', 'type']);
  });
  await knex.schema.createTable('discord_roles', (table) => {
    table.string('discord_role_id');
    table.string('type');

    table.unique(['discord_role_id', 'type']);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_roles');
  await knex.schema.dropTable('discord_roles');
}

