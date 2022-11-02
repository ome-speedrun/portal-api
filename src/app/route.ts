import { Application } from 'express';
import authorization from '@domain/authentication/handlers';
import eventsModeration from '@domain/eventModeration/handlers';

export const route = (app: Application) => {
  app.use('/auth', authorization);
  app.use('/events', eventsModeration);
};