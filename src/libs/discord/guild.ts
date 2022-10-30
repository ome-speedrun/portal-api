import axios from 'axios';
import { DiscordErrorResponse, DiscordResponseError } from './types';

const API_URL = 'https://discord.com/api';

export type DiscordRoleId = string;

export type DiscordMember = {
  nick?: string,
  roles: DiscordRoleId[],
}

export const findMemberInGuild = async (
  botToken: string,
  guildId: string,
  userId: string,
): Promise<DiscordMember | null> => {
  try {
    const response = await axios.get<DiscordMember>(
      `${API_URL}/guilds/${guildId}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        }
      }
    );
  
    return response.data;
  } catch (e) {
    if (!axios.isAxiosError(e) || !e.response) {
      throw e;
    }

    if (e.response.status === 404) {
      return null;
    }

    throw new DiscordResponseError(e.response.data as DiscordErrorResponse);
  }

};