import { Application } from 'express';
import logger from 'morgan';
import { env } from 'process';

export const logging = (app: Application) => {
  if (env.NODE_ENV === 'test') {
    return;
  }
  app.use(logger('dev'));
};