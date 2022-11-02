import { AuthenticatedLocal } from '@domain/authentication/middlewares';
import { RequestHandler } from 'express';
import { RoleType } from './models/roles';
import { retrieveUserRoles } from './usecases/retrieveUserRoles';

export type GuardOption = {
  scopes: RoleType[];
};

export const guard = (option?: GuardOption): RequestHandler<
  never, never, never, never, Partial<AuthenticatedLocal>
> => {
  return (_, res, next) => {
    if (!res.locals.user) {
      return res.status(401).send();
    }
    retrieveUserRoles(res.locals.user.id, res.locals.user.discordId)
      .then((result) => {
        if (
          result.isErr() ||
          (option?.scopes &&
            !option.scopes.some(scope => result.value.roles.includes(scope)))
        ) {
          return res.status(403).send();
        }

        return next();
      })
      .catch((e) => {
        throw e;
      });
  };

};