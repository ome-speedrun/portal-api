import { makeUser, User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient, DiscordConnection } from '@prisma/client';
import { DiscordUserId, UserId } from '@domain/types';

const prisma = new PrismaClient();

export const findUserById = async (
  id: UserId
): Promise<User | null> => {

  const user = await prisma.user.findUnique({
    where: { id },
    include: { discord_connection: true }
  });

  if (!user) {
    return null;
  }

  if (!user.discord_connection) {
    throw new Error('Invalid user data');
  }

  return makeUser(user.id, user.discord_connection.id);
};

export const findOrCreateUserByDiscordId = async (
  discordId: DiscordUserId
): Promise<User> => {

  const connection = await prisma.discordConnection.findUnique({
    where: { id: discordId },
    include: { user: true }
  });

  if (!connection) {
    const newConnection = await prisma.discordConnection.create({
      data: {
        id: discordId,
        user: {
          create: {
            id: uuidv4(),
          }
        }
      }
    });

    return discordConnectionToUser(newConnection);
  }

  return discordConnectionToUser(connection);
};

const discordConnectionToUser = (connection: DiscordConnection): User => {
  return makeUser(connection.user_id, connection.id);
};