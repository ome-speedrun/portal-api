import { AuthenticatedLocal } from '@domain/authentication/middlewares';
import { RequestHandler } from 'express';
import { RoleType } from './models/roles';
import { retrieveUserRoles } from './usecases/retrieveUserRoles';

export const allowAccessTo = (role: RoleType): RequestHandler<
  never, never, never, never, AuthenticatedLocal
> => {
  return (_, res, next) => {
    retrieveUserRoles(res.locals.user.id, res.locals.user.discordId)
      .then((result) => {
        if (result.isErr() || !result.value.roles.includes(role)) {
          return res.status(403).send();
        }

        return next();
      })
      .catch((e) => {
        throw e;
      });
  };
};