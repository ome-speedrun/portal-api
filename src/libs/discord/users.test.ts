import axios from 'axios';
import { DiscordUser, DiscordUserResponse, getMe } from './users';

jest.mock('axios');

beforeEach(() => {
  jest.resetAllMocks();
});


describe('Test to retrieve me', () => {
  it('should be received Discord user', async () => {
    jest.spyOn(axios, 'get').mockImplementation(
      (): Promise<{ data: DiscordUserResponse }> => Promise.resolve({
        data: {
          id: '80351110224678912',
          username: 'Nelly',
          discriminator: '1337',
        }
      })
    );

    const me = await getMe('bearer-token');

    expect(me).toEqual<DiscordUser>({
      id: '80351110224678912',
      username: 'Nelly',
      discriminator: '1337',
    });
  });
});