
export type DiscordCredentials = {
  clientId: string;
  clientSecret: string;
}

export type DiscordErrorResponse = {
  code: number;
  message: string;
}

export class DiscordResponseError extends Error {
  constructor(public readonly response: DiscordErrorResponse) {
    super(`Failed to request discord: ${JSON.stringify(response)}`);
  }
}
