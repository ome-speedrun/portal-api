import { DomainError } from '@domain/errors';
import { momentIn, Period, Phantom } from '@domain/types';
import moment from 'moment';

export type EventId = string;

export type HoldingPeriods = Period[];

export type EventMeta = {
  slug: string;
  totalPeriod: Period;
  holdingPeriods: HoldingPeriods;
}

export type EventProfile = {
  name: string;
  description: string;
}

export type Event = {
  id: EventId;
  meta: EventMeta;
  profile: EventProfile;
  publishedAt: moment.Moment | null;
}

export type PublicEvent = Event & { publishedAt: moment.Moment };
export type PrivateEvent = Event & { publishedAt: null };

export const isPublic = (event: Event): event is PublicEvent => {
  return !!event.publishedAt;
};

export const makePhantomEvent = (
  slug: string,
  name: string,
  holdingPeriods: HoldingPeriods,
): Phantom<Event> => {
  if (slug.length < 3) {
    throw new DomainError('Event slug must be length equals to 3 or longer.');
  }
  if (name.length < 3) {
    throw new DomainError('Event name must be length equals to 3 or longer.');
  }
  if (holdingPeriods.length === 0) {
    throw new DomainError('Event must have holding period.');
  }

  const mergedPeriods = mergePeriods(holdingPeriods);
  const totalPeriod = makeTotalPeriod(mergedPeriods);

  return {
    id: null,
    meta: {
      slug,
      totalPeriod,
      holdingPeriods: mergedPeriods,
    },
    profile: {
      name,
      description: '',
    },
    publishedAt: null,
  };
};

export const makeEvent = (
  id: EventId,
  slug: string,
  holdingPeriods: HoldingPeriods,
  profile: EventProfile,
  publishedAt: moment.Moment | null,
): Event => {
  return {
    id,
    meta: {
      slug,
      holdingPeriods,
      totalPeriod: makeTotalPeriod(holdingPeriods),
    },
    profile,
    publishedAt,
  };
};

export const editProfile = (
  event: Event,
  name: string,
  description: string,
): Event => {

  if (name.length < 3) {
    throw new DomainError('Event name must be length equals to 3 or longer.');
  }
  
  return {
    ... event,
    profile: {
      name: name || event.profile.name,
      description: description || event.profile.description
    },
  };
};

export const editMeta = (
  event: Event,
  holdingPeriods: HoldingPeriods,
): Event => {

  if (holdingPeriods.length === 0) {
    throw new DomainError('Event must have holding period.');
  }

  return {
    ... event,
    meta: {
      ... event.meta,
      holdingPeriods: mergePeriods(holdingPeriods),
    },
  };
};

const mergePeriods = (periods: Period[]): Period[] => {
  const sorted = [... periods].sort((a, b) => {
    return a.from.diff(b.from);
  });

  const merged: Period[] = [];
  let tmp: Period | null = null;
  sorted.forEach((period) => {
    if (!tmp) {
      tmp = period;
      return;
    }

    if (period.from.isAfter(tmp.to)) {
      merged.push(tmp);
      tmp = period;
      return;
    }

    if (momentIn(period.from, tmp) && period.to.isAfter(tmp.to)) {
      tmp = {
        from: tmp.from,
        to: period.to,
      };
    }
  });

  if (tmp) {
    merged.push(tmp);
  }

  return merged;
};

const makeTotalPeriod = (periods: Period[]): Period => {
  const from = periods.map((period) => period.from);
  const to = periods.map((period) => period.to);

  return {
    from: moment.min(from),
    to: moment.max(to),
  };
};