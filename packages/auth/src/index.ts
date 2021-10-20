import { Router } from 'itty-router';

import { Env } from './env';
import { authorize, handleRedirect, logout } from './auth0';

const router = Router();

router.get('/', async (request: Request, env: Env) => {
  const authResult = await authorize(request, env);
  if (authResult[0]) {
    return await fetch(`${env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${authResult[1].authorization.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (user) =>
          new Response(JSON.stringify(user), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': env.PAGE_DOMAIN,
              'Access-Control-Allow-Credentials': 'true',
            },
          })
      );
  } else {
    return new Response(null, {
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': env.PAGE_DOMAIN,
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
});

router.get('/login', async (request: Request, env: Env) => {
  try {
    const authResult = await authorize(request, env);
    if (authResult[0]) {
      return Response.redirect(env.PAGE_DOMAIN);
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
});

router.get('/auth', async (request: Request, env: Env) => {
  const authorizedResponse = await handleRedirect(request, env);

  const cors = {
    'Access-Control-Allow-Origin': env.PAGE_DOMAIN,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Expose-Headers': 'Set-Cookie',
  };
  if (!authorizedResponse) {
    return new Response('Unauthorized', { status: 401, headers: cors });
  }
  return new Response(null, {
    ...authorizedResponse,
    headers: {
      ...authorizedResponse.headers,
      ...cors,
    },
  });
});

router.get('/logout', async (request: Request, env: Env) => {
  const { headers } = await logout(request, env);
  return new Response(null, {
    headers: {
      ...headers,
      Location: `${env.AUTH0_DOMAIN}/v2/logout?client_id=${env.AUTH0_CLIENT_ID}&returnTo=${env.PAGE_DOMAIN}/logout`,
    },
    status: 302,
  });
});

router.all('*', () => new Response(null, { status: 404 }));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return router.handle(request, env);
  },
};
