import moment from 'moment';

export type Entity = {
  id: string;
}

export type Phantom<E extends Entity> = { id: null } & Omit<E, 'id'>;

export type UserId = string;
export type DiscordUserId = string;

export type Period = {
  from: moment.Moment;
  to: moment.Moment;
}

export const makePeriod = (from: string, to: string) => {
  const fromMoment = moment(from);
  const toMoment = moment(to);

  if (!fromMoment.isValid() || !toMoment.isValid()) {
    throw new Error('Invalid timestamp received!');
  }

  if (fromMoment.isAfter(toMoment)) {
    throw new Error('Invalid period received!');
  }

  return {
    from: fromMoment,
    to: toMoment,
  };
};

export const momentIn = (moment: moment.Moment, period: Period): boolean => {
  return moment.isSameOrAfter(period.from) && moment.isSameOrBefore(period.to);
};