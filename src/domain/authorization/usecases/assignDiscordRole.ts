import { ok, Result } from 'neverthrow';
import { saveDiscordRole } from '../infrastructure/prisma';
import {
  DiscordRole,
  DiscordRoleId,
  makeDiscordRole,
} from '../models/discordRole';
import { RoleType } from '../models/roles';

export const assignDiscordRole = async (
  discordRoleId: DiscordRoleId,
  roleType: RoleType,
): Promise<Result<DiscordRole, never>> => {

  const saved = await saveDiscordRole(makeDiscordRole(
    discordRoleId,
    roleType,
  ));

  return ok(saved);
};