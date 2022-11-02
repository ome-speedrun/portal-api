import {
  DomainError,
  ResourceNotFoundError,
  ResourceUnprocessableError,
} from '@domain/errors';
import { makePeriod, UserId } from '@domain/types';
import moment from 'moment';
import { err, ok, Result } from 'neverthrow';
import {
  findEventBySlug,
  listModeratorsForEvent,
  saveEvent,
} from '../infrastructure/database';
import { editMeta } from '../models/event';
import { EventAggregation, HoldingInputs } from './types';

export const modifyEventMetadata = async (
  slug: string,
  modifyBy: UserId,
  holdingPeriods: HoldingInputs
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
    const modified = await saveEvent(
      editMeta(
        event,
        holdingPeriods.map(({ from, to }) => (makePeriod(from, to)))
      )
    );
  
    return ok({ event: modified, moderators });
  } catch (e) {
    if (e instanceof DomainError) {
      return err(e);
    }

    throw e;
  }
};