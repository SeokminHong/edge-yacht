import { Router } from 'itty-router';

import { Env } from './env';

const router = Router();

router.get('/login', async (request: Request, env: Env) => {
  return new Response('new login!');
});

router.get('*', async (request: Request) => await fetch(request));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return router.handle(request, env);
  },
};
