import { nanoid } from 'nanoid';

import { Game } from './game';
import { cors } from './response';
import { PlayerIndex, getOpponent, DEFAULT_GAME } from 'shared';

// eslint-disable-next-line
type Env = {};

type Session = {
  webSocket: WebSocket;
  id: string;
  sentIndex: number;
  receivedIndex: number;
  tid: number | null;
};

async function handleErrors(request: Request, func: () => Promise<Response>) {
  return await func().catch((err: Error) => {
    if (request.headers.get('Upgrade') === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair());
      server.accept();
      server.send(
        JSON.stringify({ type: 'error', payload: { message: err.message } })
      );
      return new Response(null, {
        status: 101,
        webSocket: client,
        headers: cors,
      });
    } else {
      return new Response(err.stack, { status: 500 });
    }
  });
}

export class YachtGame implements DurableObject {
  state: DurableObjectState;
  env: Env;
  createAt: number;
  game: Game;
  sessions: {
    player1?: Session;
    player2?: Session;
  };

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.createAt = 0;
    this.game = new Game();
    this.sessions = {};
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

  updateGame(): void {
    this.sendAll(
      JSON.stringify({
        type: 'update',
        payload: { game: this.game },
      })
    );
  }

  sendAll(msg: string): void {
    this.sessions.player1?.webSocket?.send(msg);
    this.sessions.player2?.webSocket?.send(msg);
  }

  healthCheck(playerIndex: PlayerIndex): void {
    const session = this.sessions[`player${playerIndex}`];
    if (typeof session === 'undefined') {
      throw Error('Invalid session');
    }
    const { webSocket, sentIndex, receivedIndex } = session;
    session.tid = setTimeout(() => {
      if (sentIndex > receivedIndex + 3) {
        webSocket.close(1011, 'Session timed out');
        return;
      }
      console.log(`Player ${playerIndex}: Sending Health ${sentIndex + 1}`);
      webSocket.send(
        JSON.stringify({
          type: 'health',
          payload: {
            index: ++session.sentIndex,
          },
        })
      );
      this.healthCheck(playerIndex);
    }, 5000);
  }

  async handleCreate(): Promise<Response> {
    this.createAt = Date.now();
    return new Response();
  }

  async handleJoin(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      throw new Error('Upgrade header is not websocket');
    }

    if (this.game.state !== 'waiting') {
      throw new Error('Game is already started');
    }

    if (this.sessions.player1 && this.sessions.player2) {
      throw new Error('Game is full');
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
      tid: null,
    };
    this.sessions[`player${playerIndex}`] = session;

    server.accept();

    if (this.sessions.player1 && this.sessions.player2) {
      this.sessions.player1.webSocket.send(
        JSON.stringify({
          type: 'start',
          payload: { playerIndex: 1, game: this.game },
        })
      );
      this.sessions.player2.webSocket.send(
        JSON.stringify({
          type: 'start',
          payload: { playerIndex: 2, game: this.game },
        })
      );
      this.game.start();
    }

    this.healthCheck(playerIndex);
    await this.handleSession(session, ip, playerIndex).catch(() => {
      const session = this.sessions[`player${playerIndex}`];
      session && clearTimeout(session.tid);
    });
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
    const { webSocket } = session;
    webSocket.addEventListener('close', async () => {
      const session = this.sessions[`player${playerIndex}`];
      clearTimeout(session?.tid || null);
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
        case 'roll': {
          this.game.roll(playerIndex);
          this.updateGame();
          break;
        }
        case 'save': {
          this.game.save(playerIndex, payload.diceId);
          this.updateGame();
          break;
        }
        case 'load': {
          this.game.load(playerIndex, payload.diceId);
          this.updateGame();
          break;
        }
        case 'select': {
          this.game.select(playerIndex, payload.section);
          this.updateGame();
          break;
        }
        default: {
          webSocket.send(
            JSON.stringify({ type: 'error', payload: 'Unimplemented type' })
          );
        }
      }
    });
  }
}
