import * as jwt from 'jsonwebtoken';
import { User } from './user';

export type AuthenticationJwt = string;

export type AuthenticationPayload = {
  user: {
    id: string;
  }
}

export const signForUser = (user: User, secret: string): AuthenticationJwt => {
  const payload = makePayload(user);

  const token = jwt.sign(payload, secret, {
    expiresIn: '3 days',
  });

  return token;
};

export class InvalidJwtError extends Error {}

export class JwtExpiredError extends Error {}

export const verifyUser = (
  token: AuthenticationJwt, secret: string
): AuthenticationPayload => {
  try {
    const decoded = jwt.verify(token, secret);

    if (!isPayload(decoded)) {
      throw new Error();
    }

    return {
      user: {
        id: decoded.user.id,
      }
    };
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      throw new JwtExpiredError(e.message);
    }
    if (e instanceof jwt.JsonWebTokenError) {
      throw new InvalidJwtError(e.message);
    }

    throw e;
  }
};

const makePayload = (user: User): AuthenticationPayload => {
  return {
    user: {
      id: user.id,
    }
  };
};

const isPayload = (
  decoded: string | jwt.JwtPayload
): decoded is AuthenticationPayload => {
  if (typeof decoded === 'string') {
    return false;
  }

  return true;
};