import { cors } from './response';

// eslint-disable-next-line
type Env = {};

type StorageTypes = {
  //waitingState: WaitingState;
};

const getOpponent = (index: PlayerIndex) => (index === 1 ? 2 : 1);

async function handleErrors(request: Request, func: () => Promise<Response>) {
  return await func().catch((err) => {
    if (request.headers.get('Upgrade') == 'websocket') {
      const [client, server] = Object.values(new WebSocketPair());
      server.accept();
      server.send(JSON.stringify({ error: err.stack }));
      server.close(1011, 'Uncaught exception during session setup');
      return new Response(null, { status: 101, webSocket: client });
    } else {
      return new Response(err.stack, { status: 500 });
    }
  });
}

export class YachtGame implements DurableObject {
  state: DurableObjectState;
  env: Env;
  createAt: number;
  sessions: {
    player1?: WebSocket;
    player2?: WebSocket;
  };

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.createAt = 0;
    this.sessions = {};
  }

  async get<T extends keyof StorageTypes>(
    key: T
  ): Promise<StorageTypes[T] | undefined> {
    return this.state.storage?.get(key);
  }
  async put<T extends keyof StorageTypes>(
    key: T,
    value: StorageTypes[T],
    options?: DurableObjectStorageOperationsPutOptions
  ): Promise<void> {
    return this.state.storage?.put(key, value, options);
  }
  async delete<T extends keyof StorageTypes>(
    key: T,
    options?: DurableObjectStorageOperationsPutOptions
  ): Promise<boolean> {
    return this.state.storage ? this.state.storage.delete(key, options) : false;
  }

  fetch(request: Request): Promise<Response> {
    return handleErrors(request, async () => {
      const url = new URL(request.url);
      switch (url.pathname) {
        case '/create': {
          return this.handleCreate();
        }
        case '/join': {
          return this.handleJoin(request);
        }
        default: {
          return (async () => new Response())();
        }
      }
    });
  }

  async handleCreate(): Promise<Response> {
    this.createAt = Date.now();
    return new Response();
  }

  async handleJoin(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Upgrade header is not websocket', {
        status: 400,
        statusText: 'Bad Request',
        headers: cors,
      });
    }

    if (this.sessions.player1 && this.sessions.player2) {
      return new Response('Game is full', {
        status: 403,
        statusText: 'Forbidden',
        headers: cors,
      });
    }

    const ip = request.headers.get('CF-Connecting-IP');
    const [client, server] = Object.values(new WebSocketPair());

    let playerIndex = (Math.floor(Math.random() * 2) + 1) as PlayerIndex;
    if (this.sessions[`player${playerIndex}`]) {
      playerIndex = getOpponent(playerIndex);
    }
    this.sessions[`player${playerIndex}`] = server;

    server.accept();

    if (this.sessions.player1 && this.sessions.player2) {
      this.sessions.player1.send(
        JSON.stringify({ type: 'start', payload: { playerIndex: 1 } })
      );
      this.sessions.player2.send(
        JSON.stringify({ type: 'start', payload: { playerIndex: 2 } })
      );
    }

    await this.handleSession(server, ip, playerIndex);
    return new Response(null, {
      status: 101,
      webSocket: client,
      headers: cors,
    });
  }

  async handleSession(
    websocket: WebSocket,
    ip: string | null,
    playerIndex: PlayerIndex
  ): Promise<void> {
    websocket.addEventListener('close', async () => {
      this.sessions[`player${playerIndex}`] = undefined;
    });
    websocket.addEventListener('message', async (msg) => {
      if (typeof msg.data !== 'string') {
        websocket.close(1007, 'Invalid payload');
        return;
      }
      //const { type, payload } = JSON.parse(msg.data);
      //switch (type) {

      //}
    });
  }
}
