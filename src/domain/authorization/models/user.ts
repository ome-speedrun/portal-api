import { UserId } from '@domain/types';
import { DiscordRole } from './discordRole';
import { RoleType } from './roles';
import { UserRole } from './userRole';

export type User = {
  id: UserId,
  roles: RoleType[]
}

export const collectRolesForUser = (
  id: UserId,
  users: UserRole[],
  discords: DiscordRole[],
): User => {

  const roles = [
    ... users.map((u) => u.type),
    ... discords.map((d) => d.type),
  ];

  return {
    id,
    roles: [ ... new Set<RoleType>(roles)],
  };
};