import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('events', (table) => {
    table.uuid('id', { primaryKey: true });
    table.string('slug').unique();
    table.timestamp('start_at', { useTz: true });
  });

  await knex.schema.createTable('event_profiles', (table) => {
    table.uuid('event_id', { primaryKey: true });
    table.string('name');
    table.string('description');

    table.foreign('event_id', 'events.id');
  });

  await knex.schema.createTable('event_holdings', (table) => {
    table.uuid('id', { primaryKey: true });
    table.uuid('event_id');
    table.timestamp('from', { useTz: true });
    table.timestamp('to', { useTz: true });

    table.foreign('event_id', 'events.id');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('event_profiles');
  await knex.schema.dropTable('event_holdings');
  await knex.schema.dropTable('events');
}

