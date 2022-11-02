import {
  ResourceNotFoundError,
  ResourceUnprocessableError,
} from '@domain/errors';
import { UserId } from '@domain/types';
import { err, ok, Result } from 'neverthrow';
import {
  deleteEventCommand,
  findEventBySlug,
  listModeratorsForEvent,
} from '../infrastructure/database';

export const deleteEvent = async (
  slug: string,
  operatedBy: UserId,
): Promise<Result<
  void,
  ResourceNotFoundError | ResourceUnprocessableError
>> => {
  const event = await findEventBySlug(slug);

  if (!event) {
    return err(new ResourceNotFoundError());
  }

  const moderators = await listModeratorsForEvent(event.id);

  if (!moderators.some(mod => mod.id === operatedBy)) {
    return err(new ResourceUnprocessableError());
  }

  return ok(await deleteEventCommand(event));
};