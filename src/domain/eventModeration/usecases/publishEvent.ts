import {
  ResourceNotFoundError,
  ResourceUnprocessableError
} from '@domain/errors';
import { UserId } from '@domain/types';
import moment from 'moment';
import { err, ok, Result } from 'neverthrow';
import {
  findEventBySlug,
  listModeratorsForEvent,
  publishEventCommand
} from '../infrastructure/database';
import { Event } from '../models/event';

export const publishEvent = async (
  slug: string,
  now: moment.Moment,
  publishedBy: UserId,
): Promise<Result<
  Event,
  ResourceNotFoundError | ResourceUnprocessableError
>> => {
  const event = await findEventBySlug(slug);

  if (!event) {
    return err(new ResourceNotFoundError());
  }

  const moderators = await listModeratorsForEvent(event.id);

  if (!moderators.some(mod => mod.id === publishedBy)) {
    return err(new ResourceUnprocessableError());
  }

  const published = await publishEventCommand(event, now);

  return ok(published);
};