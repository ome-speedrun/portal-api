import { UserId } from '@domain/types';
import { PrismaClient } from '@prisma/client';
import {
  DiscordRole,
  DiscordRoleId,
  makeDiscordRole,
} from '../models/discordRole';
import { isRoleType } from '../models/roles';
import { makeUserRole, UserRole } from '../models/userRole';

const prisma = new PrismaClient();

export const listUserRolesById = async (id: UserId): Promise<UserRole[]> => {
  const roles = await prisma.userRole.findMany({
    select: {
      type: true,
      user_id: true,
    },
    where: { user_id: id }
  });

  return roles.map((role) => {
    if (!isRoleType(role.type)) {
      throw new Error('Unknown role type received!');
    }

    return makeUserRole(role.user_id, role.type);
  });
};

export const listDiscordRolesInId = async (
  ids: DiscordRoleId[]
): Promise<DiscordRole[]> => {
  const roles = await prisma.discordRole.findMany({
    select: {
      type: true,
      discord_role_id: true,
    },
    where: {
      discord_role_id: {
        in: ids,
      }
    }
  });

  return roles.map((role) => {
    if (!isRoleType(role.type)) {
      throw new Error('Unknown role type received!');
    }

    return makeDiscordRole(role.discord_role_id, role.type);
  });
};

export const saveDiscordRole = async (
  role: DiscordRole
): Promise<DiscordRole> => {
  const created = await prisma.discordRole.create({
    data: {
      discord_role_id: role.discordRoleId,
      type: role.type,
    }
  });

  if (!isRoleType(created.type)) {
    throw new Error('Unknown role type saved!?');
  }

  return makeDiscordRole(created.discord_role_id, created.type);
};