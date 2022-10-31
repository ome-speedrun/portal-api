import moment from 'moment';

export type Entity = {
  id: string;
}

export type Phantom<E extends Entity> = Omit<E, 'id'>;

export type UserId = string;
export type DiscordUserId = string;

export type Period = {
  from: moment.Moment;
  to: moment.Moment;
}

export const momentIn = (moment: moment.Moment, period: Period): boolean => {
  return moment.isSameOrAfter(period.from) && moment.isSameOrBefore(period.to);
};