import { nanoid } from 'nanoid';

import { cors } from './response';

// eslint-disable-next-line
type Env = {};

type Session = {
  webSocket: WebSocket;
  id: string;
  sentIndex: number;
  receivedIndex: number;
};

type StorageTypes = {
  //waitingState: WaitingState;
};

const getOpponent = (index: PlayerIndex) => (index === 1 ? 2 : 1);

async function handleErrors(request: Request, func: () => Promise<Response>) {
  return await func().catch((err: Error) => {
    if (request.headers.get('Upgrade') === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair());
      server.accept();
      server.send(
        JSON.stringify({ type: 'error', payload: { message: err.message } })
      );
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
  started: boolean;
  sessions: {
    player1?: Session;
    player2?: Session;
  };

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.createAt = 0;
    this.started = false;
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

  healthCheck(session: Session): void {
    const { webSocket, sentIndex, receivedIndex } = session;
    setTimeout(() => {
      if (sentIndex > receivedIndex + 3) {
        webSocket.close(1011, 'Session timed out');
        return;
      }
      const index =
        session === this.sessions.player1
          ? 1
          : session === this.sessions.player2
          ? 2
          : 0;
      console.log(`Player ${index}: Sending Health ${sentIndex + 1}`);
      webSocket.send(
        JSON.stringify({
          type: 'health',
          payload: {
            index: ++session.sentIndex,
          },
        })
      );
      setTimeout(this.healthCheck, 5000, session);
    }, 5000);
  }

  async handleCreate(): Promise<Response> {
    this.createAt = Date.now();
    return new Response();
  }

  async handleJoin(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      throw Error('Upgrade header is not websocket');
    }

    if (this.sessions.player1 && this.sessions.player2) {
      throw Error('Game is full');
    }

    if (this.started) {
      throw Error('Game is already started');
    }

    const ip = request.headers.get('CF-Connecting-IP');
    const [client, server] = Object.values(new WebSocketPair());

    let playerIndex = (Math.floor(Math.random() * 2) + 1) as PlayerIndex;
    if (this.sessions[`player${playerIndex}`]) {
      playerIndex = getOpponent(playerIndex);
    }
    const session = {
      webSocket: server,
      id: nanoid(),
      sentIndex: 0,
      receivedIndex: 0,
    };
    this.sessions[`player${playerIndex}`] = session;

    server.accept();

    if (this.sessions.player1 && this.sessions.player2) {
      this.sessions.player1.webSocket.send(
        JSON.stringify({ type: 'start', payload: { playerIndex: 1 } })
      );
      this.sessions.player2.webSocket.send(
        JSON.stringify({ type: 'start', payload: { playerIndex: 2 } })
      );
      this.started = true;

      this.healthCheck(this.sessions.player1);
      this.healthCheck(this.sessions.player2);
    }

    await this.handleSession(session, ip, playerIndex);
    return new Response(null, {
      status: 101,
      webSocket: client,
      headers: cors,
    });
  }

  async handleSession(
    session: Session,
    ip: string | null,
    playerIndex: PlayerIndex
  ): Promise<void> {
    const { webSocket, id, sentIndex, receivedIndex } = session;
    webSocket.addEventListener('close', async () => {
      this.sessions[`player${playerIndex}`] = undefined;
    });
    webSocket.addEventListener('message', async (msg) => {
      if (typeof msg.data !== 'string') {
        webSocket.close(1007, 'Invalid payload');
        return;
      }
      const { type, payload } = JSON.parse(msg.data);
      switch (type) {
        case 'health': {
          if (payload.index < session.receivedIndex) {
            console.log(
              `Received old health: ${payload.index} / ${session.receivedIndex}`
            );
          } else if (payload.index !== session.receivedIndex + 1) {
            console.log(
              `Skipped some healths ${payload.index} / ${session.receivedIndex}`
            );
          }
          session.receivedIndex = payload.index;
          break;
        }
      }
    });
  }
}
