import { Event } from '../models/event';
import { Moderator } from '../models/moderator';

export type HoldingInputs = { from: string; to: string; }[];

export type EventAggregation = {
  event: Event;
  moderators: Moderator[];
}