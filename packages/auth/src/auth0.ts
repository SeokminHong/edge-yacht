import cookie from 'cookie';

import { Env } from './env';

const cookieKey = 'AUTH0-AUTH';

const redirectUrl = (state: string, env: Env) =>
  `${env.AUTH0_DOMAIN}/authorize?response_type=code&client_id=${
    env.AUTH0_CLIENT_ID
  }&redirect_uri=${
    env.AUTH0_CALLBACK_URL
  }&scope=openid%20profile%20email&state=${encodeURIComponent(state)}`;

const generateStateParam = () => 'stub';

// https://github.com/pose/webcrypto-jwt/blob/master/index.js
const decodeJWT = (token: string) => {
  let output = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }

  const result = atob(output);

  try {
    return decodeURIComponent(escape(result));
  } catch (err) {
    console.log(err);
    return result;
  }
};

type AuthResult = { accessToken: string; idToken: string; userInfo: string };

const verify = async (
  request: Request,
  env: Env
): Promise<AuthResult | null> => {
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader && cookieHeader.includes(cookieKey)) {
    const cookies = cookie.parse(cookieHeader);
    if (!cookies[cookieKey]) {
      return null;
    }
    const sub = cookies[cookieKey];

    const kvData = await env.AUTH_STORE.get(sub);
    if (!kvData) {
      throw new Error('Unable to find authorization data');
    }

    let kvStored;
    try {
      kvStored = JSON.parse(kvData);
    } catch (err) {
      throw new Error('Unable to parse auth information from Workers KV');
    }

    const { access_token: accessToken, id_token: idToken } = kvStored;
    const userInfo = JSON.parse(decodeJWT(idToken));
    return { accessToken, idToken, userInfo };
  }
  return null;
};

export const authorize = async (
  request: Request,
  env: Env
): Promise<
  [true, { authorization: AuthResult }] | [false, { redirectUrl: string }]
> => {
  const authorization = await verify(request, env);
  if (authorization) {
    return [true, { authorization }];
  } else {
    const state = await generateStateParam();
    return [false, { redirectUrl: redirectUrl(state, env) }];
  }
};
