export interface EnvironmentVariables {
  HOST: string;
  DATABASE_PORT: number;
  DATABASE: string;
  USERNAME: string;
  PASSWORD: string;
  JWT_SECRET: string;
  GOOGLE_OAUTH2_CLIENTID: string;
  GOOGLE_OAUTH2_CLIENTSECRET: string;
  ACCESS_TOKEN_BLACKLIST_TTL: number;
  REFRESH_TOKEN_WHITELIST_TTL: number;
}
