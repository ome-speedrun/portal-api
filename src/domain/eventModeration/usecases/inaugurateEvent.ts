import { UserId } from '@domain/types';
import moment from 'moment';
import { Event, makePhantomEvent } from '../models/event';

type HoldingInputs = { from: string; to: string; }[];

export const inaugurateEvent = (
  creatorId: UserId,
  slug: string,
  name: string,
  holdingPeriods: HoldingInputs,
): Promise<Event> => {
  
  const event = makePhantomEvent(
    slug,
    name,
    holdingPeriods.map((input) => ({
      from: moment(input.from),
      to: moment(input.to),
    })),
  );

  throw new Error('Not implemented.');
};