import { makePeriod, UserId } from '@domain/types';
import moment from 'moment';
import { err, ok, Result } from 'neverthrow';
import {
  findEventBySlug,
  saveEvent,
  saveModerators,
} from '../infrastructure/database';
import { makePhantomEvent } from '../models/event';
import { makeModerator } from '../models/moderator';
import { EventAggregation, HoldingInputs } from './types';

export const inaugurateEvent = async (
  creatorId: UserId,
  slug: string,
  name: string,
  holdingPeriods: HoldingInputs,
): Promise<Result<EventAggregation, string>> => {

  const exists = await findEventBySlug(slug);

  if (exists) {
    return err('Slug is duplicated');
  }
  
  const event = makePhantomEvent(
    slug,
    name,
    holdingPeriods.map(({from, to}) => (makePeriod(from, to))),
  );

  const savedEvent = await saveEvent(event);
  const savedModerators = await saveModerators(
    [makeModerator(creatorId, savedEvent.id)]
  );

  return ok({
    event: savedEvent,
    moderators: savedModerators,
  });
};