import config from '@app/config';
import * as knex from 'knex';

const client = knex.default(config.knex);

export default client;