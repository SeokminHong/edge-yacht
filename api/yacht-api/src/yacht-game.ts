// eslint-disable-next-line
interface Env {}

type StorageTypes = {
  waitingState: WaitingState;
};

export class YachtGame implements DurableObject {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
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

  fetch(request: Request): Promise<Response> {
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
  }

  async handleCreate(): Promise<Response> {
    this.put('waitingState', {
      players: 0,
      createdAt: Date.now(),
      randomIndex: null,
    });
    return new Response();
  }

  async handleJoin(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Upgrade header is not websocket', {
        status: 400,
        statusText: 'Bad Request',
      });
    }
    const error = await this.state.storage?.transaction(async (txn) => {
      const waitingState: WaitingState = await txn.get('waitingState');
      if (typeof waitingState === 'undefined') {
        txn.delete('waitingState');
        return new Response('No waiting state', {
          status: 404,
          statusText: 'Not Found',
        });
      }
      if (waitingState.players >= 2) {
        return new Response('Game is full', {
          status: 403,
          statusText: 'Forbidden',
        });
      }
      txn.put('waitingState', {
        ...waitingState,
        players: waitingState.players + 1,
      });
    });
    if (error) {
      return error;
    }

    const ip = request.headers.get('CF-Connecting-IP');
    const [client, server] = Object.values(new WebSocketPair());
    await this.handleSession(server, ip);
    return new Response(null, { status: 101, webSocket: client });
  }

  async handleSession(websocket: WebSocket, ip: string | null): Promise<void> {
    websocket.accept();
    websocket.addEventListener('message', async (msg) => {
      if (typeof msg.data !== 'string') {
        websocket.close(1007, 'Invalid payload');
        return;
      }
      const { type, payload } = JSON.parse(msg.data);
      switch (type) {
        case 'waiting': {
          this.state.storage?.transaction(async (txn) => {
            const waitingState: WaitingState = await txn.get('waitingState');
            if (typeof waitingState === 'undefined') {
              websocket.close(1002, 'No waiting state');
              return;
            }
            if (waitingState.players === 2) {
              let playerIndex;
              switch (waitingState.randomIndex) {
                case null: {
                  const randomIndex = (Math.floor(Math.random() * 2) + 1) as
                    | 1
                    | 2;
                  await txn.put('waitingState', {
                    ...waitingState,
                    randomIndex,
                  });
                  playerIndex = randomIndex;
                  break;
                }
                case 1: {
                  playerIndex = 2;
                  break;
                }
                case 2: {
                  playerIndex = 1;
                  break;
                }
              }
              websocket.send(
                JSON.stringify({ type: 'start', payload: { playerIndex } })
              );
            }
          });
        }
      }
    });
  }
}
