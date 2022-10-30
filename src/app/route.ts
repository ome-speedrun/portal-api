import { Application } from 'express';
import authorization from '@domain/authentication/handlers';

export const route = (app: Application) => {
  app.use('/auth', authorization);
};