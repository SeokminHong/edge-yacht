export type Env = {
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH_STORE: KVNamespace;
  YACHT_USERS: KVNamespace;
  SALT: string;
  ROUTE_DOMAIN: string;
  PAGE_DOMAIN?: string;
};
