import { depend } from 'velona';
import {
  fetchDiscordUserWithAuthorizationCode,
} from '../infrastructure/discord';
import {
  findOrCreateUserByDiscordId
} from '../infrastructure/database';
import { Result, ok } from 'neverthrow';
import { AuthenticationJwt, signForUser } from '../models/authenticationJwt';
import config from '@app/config';

export const exchangeCodeToJwt = depend({
  fetchDiscordUserWithAuthorizationCode,
  findOrCreateUserByDiscordId,
}, async (
  { fetchDiscordUserWithAuthorizationCode }, code: string
): Promise<Result<AuthenticationJwt, never>> => {
  const discordUserId = await fetchDiscordUserWithAuthorizationCode(code);
  const user = await findOrCreateUserByDiscordId(discordUserId);
  const jwt = signForUser(user, config.jwt.secret);

  return ok(jwt);
});