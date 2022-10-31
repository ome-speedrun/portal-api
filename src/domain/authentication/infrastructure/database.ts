import { makeUser, User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { DiscordUserId, UserId } from '@domain/types';
import knex from '@libs/knex';


type UserTable = {
  id: string;
}

type DiscordConnectionTable = {
  id: string;
  user_id: string;
}

export const findUserById = async (
  id: UserId
): Promise<User | null> => {

  const user = await knex<UserTable>('users')
    .where({ id })
    .first('id');

  if (!user) {
    return null;
  }

  const discordConnection = await knex<DiscordConnectionTable>(
    'discord_connections'
  ).where({ user_id: user.id }).first('id');

  if (!discordConnection) {
    throw new Error('Invalid user data');
  }

  return makeUser(user.id, discordConnection.id);
};

export const findOrCreateUserByDiscordId = async (
  discordId: DiscordUserId
): Promise<User> => {

  const connection = await knex<DiscordConnectionTable>(
    'discord_connections'
  ).where({ id: discordId }).first('id', 'user_id');

  if (!connection) {
    return await knex.transaction(async trx => {
      const [user,] = await trx<UserTable>('users')
        .insert({
          id: uuidv4(),
        }).returning('id');
      const [newConnection,] = await trx<DiscordConnectionTable>(
        'discord_connections'
      ).insert({
        id: discordId,
        user_id: user.id,
      }).returning(['id', 'user_id']);
  
      return discordConnectionToUser(newConnection);
    });
  }

  return discordConnectionToUser(connection);
};

const discordConnectionToUser = (connection: DiscordConnectionTable): User => {
  return makeUser(connection.user_id, connection.id);
};