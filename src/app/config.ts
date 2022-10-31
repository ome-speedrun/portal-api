import configModule from 'config';
import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

type JwtConfiguration = {
  secret: string;
}

type CacheConfiguration = {
  ttl: number;
  enabled: boolean;
}

type TwitterConfiguration = {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
};

type DiscordConfiguration = {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  guildId: string;
  bot: string;
}

type Configuration = {
  debug: boolean;
  jwt: JwtConfiguration;
  hashtag: string;
  cache: CacheConfiguration;
  twitter: TwitterConfiguration;
  discord: DiscordConfiguration;
  knex: Knex.Config;
}

dotenv.config();

export const knexConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    database: 'portal-api',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};

const config: Configuration = {
  debug: configModule.get('debug'),
  jwt: {
    secret: configModule.get('jwt.secret'),
  },
  hashtag: configModule.get('hashtag'),
  cache: {
    ttl: configModule.get('cache.ttl'),
    enabled: configModule.get('cache.enabled'),
  },
  twitter: {
    apiKey: configModule.get('twitter.apiKey'),
    apiSecret: configModule.get('twitter.apiSecret'),
    accessToken: configModule.get('twitter.accessToken'),
    accessSecret: configModule.get('twitter.accessSecret'),
  },
  discord: {
    clientId: configModule.get('discord.clientId'),
    clientSecret: configModule.get('discord.clientSecret'),
    redirectUrl: configModule.get('discord.redirectUrl'),
    guildId: configModule.get('discord.guildId'),
    bot: configModule.get('discord.bot'),
  },
  knex: knexConfig,
};

export default config;