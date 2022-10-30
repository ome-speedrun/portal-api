import axios from 'axios';
import {
  DiscordCredentials,
  DiscordErrorResponse,
  DiscordResponseError,
} from './types';

import querystring from 'querystring';

const API_URL = 'https://discord.com/api';

export type AuthorizeUrl = string;

export const generateAuthorizeUrl = (
  credentials: DiscordCredentials,
  scopes: Set<string>,
  state: string,
  redirectUrl: string,
): AuthorizeUrl => {

  const endpoint = 'https://discord.com/api/oauth2/authorize';

  const query = querystring.stringify({
    response_type: 'code',
    prompt: 'consent',
    client_id: credentials.clientId,
    scope: [...scopes].join(' '),
    state,
    redirect_uri: redirectUrl,
  });

  return `${endpoint}?${query.toString()}`;
};

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type AccessTokens = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
};

export const exchangeAuthCode = async (
  credentials: DiscordCredentials,
  code: string,
  redirectUrl: string,
): Promise<AccessTokens> => {

  console.log(code);
  const data = {
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUrl,
  };

  try {
    const { data: response } = await axios.postForm<
      AccessTokenResponse
    >(
      `${API_URL}/oauth2/token`, data
    );
    
    return {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token,
      scope: response.scope,
    };

  } catch (e) {
    if (!axios.isAxiosError(e) || !e.response) {
      throw e;
    }

    throw new DiscordResponseError(e.response.data as DiscordErrorResponse);
  }
};