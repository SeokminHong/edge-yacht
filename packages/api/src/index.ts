import { cors } from './response';
export { YachtGame } from './yacht-game';

interface Env {
  yachtGame: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/create':
        // Create a game session and redirect to the wating room.
        return handleCreate(request, env);
      case '/join':
        // Start game.
        return handleJoin(request, env);
      default:
        return new Response('Not found', { status: 404, headers: cors });
    }
  },
};

async function handleCreate(request: Request, env: Env): Promise<Response> {
  const id = env.yachtGame.newUniqueId();
  await env.yachtGame.get(id).fetch(request);
  return new Response(JSON.stringify({ id: id.toString() }), {
    status: 200,
    headers: cors,
  });
}

async function handleJoin(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const roomId = url.searchParams.get('id');
  if (!roomId) {
    return new Response('Room not found', { status: 404, headers: cors });
  }
  const room = env.yachtGame.get(env.yachtGame.idFromString(roomId));
  if (!room) {
    return new Response('Room not found', { status: 404, headers: cors });
  }
  return await room.fetch(request);
}
