import { Router } from 'itty-router';

import { Env } from './env';
import { getUserInfo, handleLogin, handleAuth, handleLogout } from './auth';

const router = Router();

// Get user information
router.get('/userinfo', getUserInfo);

// Login endpoint
router.get('/login', handleLogin);

// Auth0 login callback
router.get('/auth', handleAuth);

// Logout endpoint
router.get('/logout', handleLogout);

// Route Cloudflare Pages
router.get('*', async (request: Request, env: Env) => {
  let url = request.url;
  if (env.PAGE_DOMAIN) {
    url = url.replace(env.ROUTE_DOMAIN, env.PAGE_DOMAIN);
  }

  if (request.headers.get('Upgrade') !== 'websocket') {
    return await fetch(url, request);
  }

  // Websocket request
  // It's required for development HMR
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
