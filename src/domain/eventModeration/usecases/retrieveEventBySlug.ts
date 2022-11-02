import { UserId } from '@domain/types';
import { ok, Result } from 'neverthrow';
import {
  findEventBySlug,
  listModeratorsForEvent,
} from '../infrastructure/database';
import { isPublic } from '../models/event';
import { EventAggregation } from './types';

export const retrieveEventBySlug = async (
  slug: string,
  retrievedBy?: UserId,
): Promise<Result<EventAggregation | null, never>> => {
  const event = await findEventBySlug(slug);

  if (!event) {
    return ok(null);
  }

  const moderators = await listModeratorsForEvent(event.id);

  if (!isPublic(event) && !moderators.some(mod => mod.id === retrievedBy)) {
    return ok(null);
  }

  return ok({
    event,
    moderators
  });
};