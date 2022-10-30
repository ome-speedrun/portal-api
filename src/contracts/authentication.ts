export type AuthenticationUrlResponse = {
  url: string;
}

export type GenerateDiscordUrl = () => Promise<AuthenticationUrlResponse>;

export type CallbackRequest = {
  code: string;
  state: string;
};

export type CallbackResponse = {
  jwt: string;
};

export type ProcessDiscordCallback = (
  request: CallbackRequest
) => Promise<CallbackResponse>;