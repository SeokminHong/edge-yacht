import { Router } from 'itty-router';

import { Env } from './env';
import { authorize, handleRedirect, logout } from './auth0';

const router = Router();

router.get('/userinfo', async (request: Request, env: Env) => {
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
            },
          })
      );
  } else {
    return new Response(null, {
      status: 401,
    });
  }
});

router.get('/login', async (request: Request, env: Env) => {
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
});

router.get('/auth', async (request: Request, env: Env) => {
  const authorizedResponse = await handleRedirect(request, env);

  if (!authorizedResponse) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response(null, {
    ...authorizedResponse,
  });
});

router.get('/logout', async (request: Request, env: Env) => {
  const { headers } = await logout(request, env);
  return new Response(null, {
    headers: {
      ...headers,
      Location: `${env.AUTH0_DOMAIN}/v2/logout?client_id=${env.AUTH0_CLIENT_ID}&returnTo=${env.PAGE_DOMAIN}`,
    },
    status: 302,
  });
});

router.get('*', async (request: Request, env: Env) => {
  let url = request.url;
  if (env.PAGE_DOMAIN) {
    url = url.replace(env.ROUTE_DOMAIN, env.PAGE_DOMAIN);
  }

  if (request.headers.get('Upgrade') !== 'websocket') {
    return await fetch(url, request);
  }

  // Websocket request
  const [client, server] = Object.values(new WebSocketPair());
  const res = await fetch(url, {
    headers: {
      Upgrade: 'websocket',
    },
  });
  if (!res.webSocket) {
    throw Error();
  }
  const routerWs = res.webSocket;
  routerWs.accept();
  server.accept();

  // Relay socket events
  routerWs.addEventListener('message', (m) => server.send(m.data));
  server.addEventListener('message', (m) => routerWs.send(m.data));
  routerWs.addEventListener('close', () => server.close());
  server.addEventListener('close', () => routerWs.close());

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return router.handle(request, env);
  },
};
