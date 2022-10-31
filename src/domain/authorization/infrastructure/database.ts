import { UserId } from '@domain/types';
import {
  DiscordRole,
  DiscordRoleId,
  makeDiscordRole,
} from '../models/discordRole';
import { isRoleType } from '../models/roles';
import { makeUserRole, UserRole } from '../models/userRole';
import knex from '@libs/knex';

type UserRoleTable = {
  user_id: string;
  type: string;
}

type DiscordRoleTable = {
  discord_role_id: string;
  type: string;
}

export const listUserRolesById = async (id: UserId): Promise<UserRole[]> => {
  const roles = await knex<UserRoleTable>('user_roles')
    .where({ user_id: id }).select('user_id', 'type');

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
  const roles = await knex<DiscordRoleTable>('discord_roles')
    .whereIn('discord_role_id', ids)
    .select('discord_role_id', 'type');

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
  const [created,] = await knex<DiscordRoleTable>('discord_roles')
    .insert({
      discord_role_id: role.discordRoleId,
      type: role.type,
    }).returning(['discord_role_id', 'type']);

  if (!isRoleType(created.type)) {
    throw new Error('Unknown role type saved!?');
  }

  return makeDiscordRole(created.discord_role_id, created.type);
};