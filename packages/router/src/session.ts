import { Env } from './env';

export const handleCreate = async (request: Request, env: Env) => {
  const id = env.yachtGame.newUniqueId();
  await env.yachtGame.get(id).fetch(request);
  return new Response(JSON.stringify({ id: id.toString() }), {
    status: 200,
  });
};

export const handleJoin = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const roomId = url.searchParams.get('id');
  if (!roomId) {
    return new Response('Room not found', { status: 404 });
  }
  const room = env.yachtGame.get(env.yachtGame.idFromString(roomId));
  if (!room) {
    return new Response('Room not found', { status: 404 });
  }
  return await room.fetch(request);
};
