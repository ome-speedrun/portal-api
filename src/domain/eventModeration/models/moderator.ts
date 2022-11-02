import { UserId } from '@domain/types';
import { EventId } from './event';

export type Moderator = {
  id: UserId;
  eventId: EventId;
}

export const makeModerator = (
  userId: UserId,
  eventId: EventId,
): Moderator => {
  return {
    id: userId,
    eventId,
  };
};