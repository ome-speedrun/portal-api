import { RoleType } from './roles';

export type DiscordRoleId = string;

export type DiscordRole = {
  discordRoleId: DiscordRoleId;
  type: RoleType;
}

export const makeDiscordRole = (
  discordRoleId: DiscordRoleId,
  type: RoleType
) => {
  return {
    discordRoleId,
    type,
  };
};