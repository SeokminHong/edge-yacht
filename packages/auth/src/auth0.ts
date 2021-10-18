import cookie from 'cookie';
import { nanoid } from 'nanoid';

import { Env } from './env';

type Token = {
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
};

const cookieKey = 'AUTH0-AUTH';

const redirectUrl = (state: string, env: Env) =>
  `${env.AUTH0_DOMAIN}/authorize?response_type=code&client_id=${
    env.AUTH0_CLIENT_ID
  }&redirect_uri=${
    env.AUTH0_CALLBACK_URL
  }&scope=openid%20profile%20email&state=${encodeURIComponent(state)}`;

const exchangeCode = async (code: string, env: Env) => {
  const body = JSON.stringify({
    grant_type: 'authorization_code',
    client_id: env.AUTH0_CLIENT_ID,
    client_secret: env.AUTH0_CLIENT_SECRET,
    code,
    redirect_uri: env.AUTH0_CALLBACK_URL,
  });

  try {
    const res = await fetch(env.AUTH0_DOMAIN + '/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    return persistAuth(res, env);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const validateToken = (token: Token, env: Env) => {
  try {
    const dateInSecs = (d: Date) => Math.ceil(Number(d) / 1000);
    const date = new Date();

    let iss = token.iss;

    // ISS can include a trailing slash but should otherwise be identical to
    // the AUTH0_DOMAIN, so we should remove the trailing slash if it exists
    iss = iss.endsWith('/') ? iss.slice(0, -1) : iss;

    if (iss !== env.AUTH0_DOMAIN) {
      throw new Error(
        `Token iss value (${iss}) doesn't match AUTH0_DOMAIN (${env.AUTH0_DOMAIN})`
      );
    }

    if (token.aud !== env.AUTH0_CLIENT_ID) {
      throw new Error(
        `Token aud value (${token.aud}) doesn't match AUTH0_CLIENT_ID (${env.AUTH0_CLIENT_ID})`
      );
    }

    if (token.exp < dateInSecs(date)) {
      throw new Error(`Token exp value is before current time`);
    }

    // Token should have been issued within the last day
    date.setDate(date.getDate() - 1);
    if (token.iat < dateInSecs(date)) {
      throw new Error(`Token was issued before one day ago and is now invalid`);
    }

    return true;
  } catch (err) {
    console.log((err as Error).message);
    return false;
  }
};

const persistAuth = async (exchange: Response, env: Env) => {
  const body: { error?: string; id_token: string } = await exchange.json();

  if (!exchange.ok || body.error) {
    throw new Error(body.error);
  }

  const date = new Date();
  date.setDate(date.getDate() + 1);

  const decoded: Token = JSON.parse(decodeJWT(body.id_token));
  const validToken = validateToken(decoded, env);
  if (!validToken) {
    return { status: 401 };
  }

  const text = new TextEncoder().encode(`${env.SALT}-${decoded.sub}`);
  const digest = await crypto.subtle.digest({ name: 'SHA-256' }, text);
  const digestArray = Array.from(new Uint8Array(digest));
  const id = btoa(String.fromCharCode.apply(null, digestArray));

  await env.AUTH_STORE.put(id, JSON.stringify(body));

  const headers = {
    Location: '/',
    'Set-cookie': `${cookieKey}=${id}; Secure; HttpOnly; SameSite=Lax; Expires=${date.toUTCString()}`,
  };

  return { headers, status: 302 };
};

export const handleRedirect = async (request: Request, env: Env) => {
  const url = new URL(request.url);

  const state = url.searchParams.get('state');
  if (!state) {
    return null;
  }

  const storedState = await env.AUTH_STORE.get(`state-${state}`);
  if (!storedState) {
    return null;
  }

  const code = url.searchParams.get('code');
  if (code) {
    return exchangeCode(code, env);
  }

  return null;
};

const generateStateParam = async (env: Env) => {
  const state = nanoid();
  await env.AUTH_STORE.put(`state-${state}`, 'true', { expirationTtl: 60 });
  return state;
};

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
    const state = await generateStateParam(env);
    return [false, { redirectUrl: redirectUrl(state, env) }];
  }
};

export const logout = (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader && cookieHeader.includes(cookieKey)) {
    return {
      headers: {
        'Set-cookie': `${cookieKey}=""; HttpOnly; Secure; SameSite=Lax;`,
      },
    };
  }
  return {};
};
