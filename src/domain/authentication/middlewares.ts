import { NextFunction, Request, Response as ExpressResponse } from 'express';
import { User } from './models/user';
import { authenticateUserWithJwt } from './usecases/authenticateUserWithJwt';

type Response = ExpressResponse<never, AuthenticatedLocal>;

export type AuthenticatedLocal = {
  user: User
};

const fetchAuthorizationToken = (header: string): [string, string] => {
  const [type, token] = header.split(' ');

  return [type, token];
};

const failedAuthorization = (res: Response) => {
  return res.status(401).send();
};

export const authenticateWithJwt = (
  req: Request, res: Response, next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return failedAuthorization(res);
  }

  const [type, token] = fetchAuthorizationToken(authorization);

  if (type !== 'Bearer') {
    return failedAuthorization(res);
  }

  authenticateUserWithJwt(token)
    .then((user) => {
      if (user.isErr()) {
        return failedAuthorization(res);
      }

      res.locals.user = user.value;
      next();
    })
    .catch(() => {
      failedAuthorization(res);
    });

};