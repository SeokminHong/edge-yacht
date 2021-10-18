import { Router } from 'itty-router';

import { Env } from './env';
import { authorize, handleRedirect, logout } from './auth0';

const router = Router();

router.get('/', async (request: Request, env: Env) => {
  const response = new Response(null);

  try {
    const authResult = await authorize(request, env);

    if (authResult[0]) {
      request = new Request(request, {
        headers: {
          Authorization: `Bearer ${authResult[1].authorization.accessToken}`,
        },
      });
    } else {
      return Response.redirect(authResult[1].redirectUrl);
    }

    return response;
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
  if (!authorizedResponse) {
    return new Response('Unauthorized', { status: 401 });
  }
  const response = new Response(null, {
    ...authorizedResponse,
  });
  return response;
});

router.get('/logout', async (request: Request) => {
  const { headers } = logout(request);
  const redirect = Response.redirect('http://localhost:8000/');
  new Response(null, {
    ...redirect,
    headers: {
      ...redirect.headers,
      ...headers,
    },
  });
});

router.all('*', () => new Response(null, { status: 404 }));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return router.handle(request, env);
  },
};
