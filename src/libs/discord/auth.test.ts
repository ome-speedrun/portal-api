import axios from 'axios';
import {
  AccessTokenResponse,
  AccessTokens,
  exchangeAuthCode,
  generateAuthorizeUrl
} from './auth';

jest.mock('axios');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Test to generate authenticate URL', () => {
  it('should be generated discord authentication URL', () => {
    const url = generateAuthorizeUrl(
      {
        clientId: 'client-id-for-test',
        clientSecret: 'client-secret-for-test',
      },
      new Set<string>(['identify', 'email']),
      'state-for-test',
      'http://redirect.example.com',
    );

    expect(url).toBe(
      // eslint-disable-next-line max-len
      'https://discord.com/api/oauth2/authorize?response_type=code&prompt=consent&client_id=client-id-for-test&scope=identify%20email&state=state-for-test&redirect_uri=http%3A%2F%2Fredirect.example.com'
    );
  });
});

describe('Test to exchange code for authentication', () => {

  describe('when success to exchange access token', () => {
    it('should be returned access tokens', async () => {
      jest.spyOn(axios, 'postForm').mockImplementation(
        (): Promise<{data: AccessTokenResponse}> => Promise.resolve({
          data: {
            access_token: 'access-token',
            token_type: 'Bearer',
            expires_in: 600000,
            refresh_token: 'refresh-token',
            scope: 'identify',
          }
        })
      );

      const result = await exchangeAuthCode(
        {
          clientId: 'client-id-for-test',
          clientSecret: 'client-secret-for-test',
        },
        'authentication_code',
        'http://redirect.example.com',
      );

      expect(result).toEqual<AccessTokens>({
        accessToken: 'access-token',
        tokenType: 'Bearer',
        expiresIn: 600000,
        refreshToken: 'refresh-token',
        scope: 'identify',
      });
    });
  });
});