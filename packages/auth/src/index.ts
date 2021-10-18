import { Router } from 'itty-router';

import { Env } from './env';
import { authorize } from './auth0';

const router = Router();

router.get('/', async (request: Request, env: Env) => {
  console.log(env);
  const response = new Response(null);
  const url = new URL(request.url);

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

router.get('/auth', async () => {
  return new Response(null);
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return router.handle(request, env);
  },
};
