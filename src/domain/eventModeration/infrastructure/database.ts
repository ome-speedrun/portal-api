import { Phantom } from '@domain/types';
import { Event, EventId, HoldingPeriods, makeEvent } from '../models/event';
import knex from '@libs/knex';
import { v4 as uuidv4 } from 'uuid';
import { Moderator } from '../models/moderator';
import moment from 'moment';

type EventTable = {
  id: string;
  slug: string;
  start_at: string;
}

type EventProfileTable = {
  event_id: string;
  name: string;
  description: string;
}

type EventHoldingTable = {
  id: string;
  event_id: string;
  from: string;
  to: string;
}

type EventModeratorTable = {
  user_id: string;
  event_id: string;
}

type EventPublicationTable = {
  event_id: string;
  published_at: string;
}

export const saveEvent = async (
  event: Phantom<Event> | Event
): Promise<Event> => {

  return await knex.transaction(async trx => {
    const [saved, ] = await trx<EventTable>('events')
      .insert({
        id: event.id || uuidv4(),
        slug: event.meta.slug,
        start_at: event.meta.totalPeriod.from.toISOString(),
      })
      .onConflict('id').merge().returning('id');

    await trx<EventProfileTable>('event_profiles')
      .insert({
        event_id: saved.id,
        name: event.profile.name,
        description: event.profile.description,
      })
      .onConflict('event_id').merge();

    await trx<EventHoldingTable>('event_holdings')
      .where('event_id', saved.id).delete();

    await trx<EventHoldingTable>('event_holdings')
      .insert(event.meta.holdingPeriods.map((period) => ({
        id: uuidv4(),
        event_id: saved.id,
        from: period.from.toISOString(),
        to: period.to.toISOString(),
      })));

    return {
      ... event,
      id: saved.id,
    };
  });
};

export const publishEventCommand = async (
  event: Event,
  now: moment.Moment,
): Promise<Event> => {

  await knex<EventPublicationTable>('event_publications')
    .insert({
      event_id: event.id,
      published_at: now.toISOString(),
    }).onConflict().ignore();

  return makeEvent(
    event.id,
    event.meta.slug,
    event.meta.holdingPeriods,
    event.profile,
    now,
  );
};

export const deleteEventCommand = async (
  event: Event
): Promise<void> => {

  await knex<EventTable>('events')
    .where('id', event.id).delete();
};

export const saveModerators = async (
  moderators: Moderator[]
): Promise<Moderator[]> => {

  const saved = await knex<EventModeratorTable>('event_moderators')
    .insert(moderators.map((mod) => ({
      event_id: mod.eventId,
      user_id: mod.id,
    })))
    .onConflict(['event_id', 'user_id']).ignore()
    .returning(['event_id', 'user_id']);

  return saved.map((row) => ({
    id: row.user_id,
    eventId: row.event_id,
  }));
};

export const findEventBySlug = async (
  slug: string
): Promise<Event | null> => {

  const event = await knex<EventTable>('events')
    .where({ slug })
    .first('id', 'slug', 'start_at');

  if (!event) {
    return null;
  }

  const profile = await knex<EventProfileTable>('event_profiles')
    .where({ event_id: event.id })
    .first('name', 'description');

  if (!profile) {
    throw new Error(`The event is in invalid state! [${event.id}]`);
  }
    
  const periodRows = await knex<EventHoldingTable>('event_holdings')
    .where({ event_id: event.id })
    .select('from', 'to');

  const holdingPeriods: HoldingPeriods = periodRows.map(period => ({
    from: moment(period.from),
    to: moment(period.to),
  }));

  const publication = await knex<EventPublicationTable>('event_publications')
    .where({ event_id: event.id })
    .first('published_at');

  return makeEvent(
    event.id,
    event.slug,
    holdingPeriods,
    {
      name: profile.name,
      description: profile.description
    },
    publication ? moment(publication.published_at) : null,
  );
};

export const listModeratorsForEvent = async (
  eventId: EventId
): Promise<Moderator[]> => {
  const rows = await knex<EventModeratorTable>('event_moderators')
    .where({ event_id: eventId })
    .select('event_id', 'user_id');

  return rows.map(row => ({
    id: row.user_id,
    eventId: row.event_id,
  }));
};