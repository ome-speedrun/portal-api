import axios from 'axios';
import { DiscordErrorResponse, DiscordResponseError } from './types';

const API_URL = 'https://discord.com/api';

export type DiscordUserResponse = {
  id: string;
  username: string;
  discriminator: string;
};

export type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
};

export const getMe = async (bearer: string): Promise<DiscordUser> => {
  try {
    const response = await axios.get<DiscordUserResponse>(
      `${API_URL}/users/@me`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
        }
      }
    );

    return response.data;

  } catch (e) {
    if (!axios.isAxiosError(e) || !e.response) {
      throw e;
    }

    throw new DiscordResponseError(e.response.data as DiscordErrorResponse);
  }
};