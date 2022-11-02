import {
  DomainError,
  ResourceNotFoundError,
  ResourceUnprocessableError,
} from '@domain/errors';
import { UserId } from '@domain/types';
import { err, ok, Result } from 'neverthrow';
import {
  findEventBySlug,
  listModeratorsForEvent,
  saveEvent,
} from '../infrastructure/database';
import { editProfile } from '../models/event';
import { EventAggregation } from './types';

export const modifyEventProfile = async (
  slug: string,
  modifyBy: UserId,
  name: string,
  description: string,
): Promise<Result<
  EventAggregation,
  ResourceNotFoundError | ResourceUnprocessableError | DomainError
>> => {

  const event = await findEventBySlug(slug);

  if (!event) {
    return err(new ResourceNotFoundError());
  }
  
  const moderators = await listModeratorsForEvent(event.id);

  if (!moderators.some((mod) => mod.id === modifyBy)) {
    return err(new ResourceUnprocessableError());
  }

  try {
    const modified = await saveEvent(editProfile(event, name, description));

    return ok({
      event: modified,
      moderators,
    });
  } catch (e) {
    if (e instanceof DomainError) {
      return err(e);
    }

    throw e;
  }

};