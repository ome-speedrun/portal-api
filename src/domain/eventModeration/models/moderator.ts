import { UserId } from '@domain/types';
import { EventId } from './event';

export type Moderator = {
  id: UserId;
  eventId: EventId;
}