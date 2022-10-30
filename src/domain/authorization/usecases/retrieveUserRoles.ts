import config from '@app/config';
import { DiscordUserId, UserId } from '@domain/types';
import { findMemberInGuild } from '@libs/discord/guild';
import { ok, Result } from 'neverthrow';
import {
  listDiscordRolesInId,
  listUserRolesById
} from '../infrastructure/prisma';
import { collectRolesForUser, User } from '../models/user';

export const retrieveUserRoles = async (
  userId: UserId, discordId: DiscordUserId
): Promise<Result<User, never>> => {
  const discordMember = await findMemberInGuild(
    config.discord.bot,
    config.discord.guildId,
    discordId,
  );

  const discordRoles = discordMember
    ? await listDiscordRolesInId(discordMember.roles) : [];
  const userRoles = await listUserRolesById(userId);

  return ok(collectRolesForUser(userId, userRoles, discordRoles));
};