export type Entity = {
  id: string;
}

export type Phantom<E extends Entity> = Omit<E, 'id'>;

export type UserId = string;
export type DiscordUserId = string;