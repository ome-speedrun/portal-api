import config from '@app/config';
import { generateAuthorizeUrl } from '@libs/discord/auth';
import { Result, ok } from 'neverthrow';

export const generateAuthorizationUrlWithDiscord
= (): Result<string, never> => {
  const url = generateAuthorizeUrl(
    {
      clientId: config.discord.clientId,
      clientSecret: config.discord.clientSecret,
    },
    new Set(['identify']),
    'state',
    config.discord.redirectUrl,
  );

  return ok(url);
};