import { DiscordUserId, UserId } from '@domain/types';

export type User = {
  id: UserId;
  discordId: DiscordUserId;
}

export const makeUser = (id: UserId, discordId: DiscordUserId): User => {
  return {
    id,
    discordId,
  };
};