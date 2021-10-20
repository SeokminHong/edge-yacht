import { Env } from './env';
import { User } from 'shared';

import { authorize, handleRedirect, logout } from './auth0';

export const getUserInfo = async (request: Request, env: Env) => {
  const authResult = await authorize(request, env);
  if (authResult[0]) {
    const userInfo = authResult[1].authorization.userInfo;
    const kvUser = await env.YACHT_USERS.get(userInfo.sub);
    let user: User;
    if (kvUser) {
      user = JSON.parse(kvUser);
    } else {
      user = {
        nickname: userInfo.nickname,
        picture: userInfo.picture,
        wins: 0,
        playCount: 0,
      };
      env.YACHT_USERS.put(userInfo.sub, JSON.stringify(user));
    }
    return new Response(JSON.stringify(user), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    return new Response(null, {
      status: 401,
    });
  }
};

export const handleLogin = async (request: Request, env: Env) => {
  try {
    const authResult = await authorize(request, env);
    if (authResult[0]) {
      return Response.redirect('/');
    } else {
      return Response.redirect(authResult[1].redirectUrl);
    }
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 500 });
    } else {
      // eslint-disable-next-line
      return new Response((e as any).toString(), { status: 500 });
    }
  }
};

export const handleAuth = async (request: Request, env: Env) => {
  const authorizedResponse = await handleRedirect(request, env);

  if (!authorizedResponse) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response(null, {
    ...authorizedResponse,
  });
};

export const handleLogout = async (request: Request, env: Env) => {
  const { headers } = await logout(request, env);
  return new Response(null, {
    headers: {
      ...headers,
      Location: `${env.AUTH0_DOMAIN}/v2/logout?client_id=${env.AUTH0_CLIENT_ID}&returnTo=${env.ROUTE_DOMAIN}`,
    },
    status: 302,
  });
};
