import { Env } from './env';

const redirectUrl = (state, env: Env) =>
  `${env.AUTH0_DOMAIN}/authorize?response_type=code&client_id=${
    env.AUTH0_CLIENT_ID
  }&redirect_uri=${
    env.AUTH0_CALLBACK_URL
  }&scope=openid%20profile%20email&state=${encodeURIComponent(state)}`;

const generateStateParam = () => 'stub';

const verify = async (event) => {
  // Verify a user based on an auth cookie and Workers KV data
  return { accessToken: '123' };
};

export const authorize = async (event, env: Env) => {
  const authorization = await verify(event);
  if (authorization.accessToken) {
    return [true, { authorization }];
  } else {
    const state = await generateStateParam();
    return [false, { redirectUrl: redirectUrl(state, env) }];
  }
};
