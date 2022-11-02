export type EventResource = {
  id: string;
  slug: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  holdingPeriods: PeriodInput[];
  moderators: ModeratorResource[];
};

export type ModeratorResource = {
  id: string;
}

export type PeriodInput = {
  from: string;
  to: string;
}

export type ShowEventRequest = {
  slug: string;
}

export type ShowEventResponse = EventResource;

export type ShowEvent = (
  request: ShowEventRequest
) => ShowEventResponse;

export type CreateEventRequest = {
  slug: string;
  name: string;
  periods: PeriodInput[];
}

export type CreateEventResponse = EventResource;

export type CreateEvent = (
  request: CreateEventRequest,
) => Promise<CreateEventResponse>;

export type EditEventProfileRequest = {
  name: string;
  description: string;
}

export type EditEventProfile = (
  slug: string,
  request: EditEventProfileRequest,
) => Promise<void>;

export type EditEventMetaRequest = {
  periods: PeriodInput[];
}

export type EditEventMeta = (
  slut: string,
  request: EditEventMetaRequest,
) => Promise<void>