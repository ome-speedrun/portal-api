import config from '@app/config';
import { ok, err, Result } from 'neverthrow';
import { findUserById } from '../infrastructure/prisma';
import {
  InvalidJwtError,
  JwtExpiredError,
  verifyUser,
} from '../models/authenticationJwt';
import { User } from '../models/user';

export const authenticateUserWithJwt = async (
  jwt: string
): Promise<Result<User, null>> => {
  try {
    const payload = verifyUser(jwt, config.jwt.secret);

    const user = await findUserById(payload.user.id);

    if (!user) {
      return err(user);
    }

    return ok(user);

  } catch (e) {
    if (e instanceof InvalidJwtError || e instanceof JwtExpiredError) {
      return err(null);
    }
    throw e;
  }
};