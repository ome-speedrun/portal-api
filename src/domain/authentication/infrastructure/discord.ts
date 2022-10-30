import config from '@app/config';
import { DiscordUserId } from '@domain/types';
import { exchangeAuthCode } from '@libs/discord/auth';
import { getMe } from '@libs/discord/users';

export const fetchDiscordUserWithAuthorizationCode = async (
  code: string
): Promise<DiscordUserId> => {
  const accessTokens = await exchangeAuthCode(
    {
      clientId: config.discord.clientId,
      clientSecret: config.discord.clientSecret,
    },
    code,
    config.discord.redirectUrl,
  );

  const user = await getMe(accessTokens.accessToken);

  return user.id;
};