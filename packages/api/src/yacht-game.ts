import { nanoid } from 'nanoid';
import { PlayerIndex, getOpponent, Message, Payload, User } from 'shared';

import { authorize } from './auth0';
import { Env } from './env';
import { Game } from './game';

type Session = {
  webSocket: WebSocket;
  id: string;
  sentIndex: number;
  receivedIndex: number;
  tid: number | null;
  user?: User;
  sub?: string;
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
        case '/api/create': {
          return this.handleCreate();
        }
        case '/api/join': {
          return this.handleJoin(request);
        }
        default: {
          throw Error('Invalid path');
        }
      }
    });
  }

  updateGame(): void {
    this.sendAll('update', { game: this.game });
  }

  endGame(disconnectedPlayer?: PlayerIndex): void {
    let winner: PlayerIndex | null = null;
    if (disconnectedPlayer) {
      winner = getOpponent(disconnectedPlayer);
    } else {
      const score1 = Object.values(this.game.players[0].score).reduce<number>(
        (sum, v) => sum + (v ?? 0),
        0
      );
      const score2 = Object.values(this.game.players[1].score).reduce<number>(
        (sum, v) => sum + (v ?? 0),
        0
      );
      winner = score1 > score2 ? 1 : score1 === score2 ? null : 2;
    }
    this.send(1, 'end', {
      result: winner === 1 ? 'win' : winner === 2 ? 'lose' : 'draw',
    });
    this.send(2, 'end', {
      result: winner === 2 ? 'win' : winner === 1 ? 'lose' : 'draw',
    });
    if (this.sessions.player1?.sub && this.sessions.player1.user) {
      this.env.YACHT_USERS.put(
        this.sessions.player1.sub,
        JSON.stringify({
          ...this.sessions.player1.user,
          wins: this.sessions.player1.user.wins + (winner === 1 ? 1 : 0),
          playCount: this.sessions.player1.user.playCount + 1,
        })
      );
    }
    if (this.sessions.player2?.sub && this.sessions.player2.user) {
      this.env.YACHT_USERS.put(
        this.sessions.player2.sub,
        JSON.stringify({
          ...this.sessions.player2.user,
          wins: this.sessions.player2.user.wins + (winner === 2 ? 1 : 0),
          playCount: this.sessions.player2.user.playCount + 1,
        })
      );
    }
  }

  sendAll<T extends Message>(type: T, payload: Payload[T]): void {
    const msg = JSON.stringify({ type, payload });
    this.sessions.player1?.webSocket?.send(msg);
    this.sessions.player2?.webSocket?.send(msg);
  }

  send<T extends Message>(
    playerIndex: PlayerIndex,
    type: T,
    payload: Payload[T]
  ): void {
    const session = this.sessions[`player${playerIndex}`];
    if (typeof session === 'undefined') {
      throw Error('Invalid session');
    }
    const { webSocket } = session;
    webSocket.send(JSON.stringify({ type, payload }));
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
      this.send(playerIndex, 'health', { index: ++session.sentIndex });
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

    const authorization = await authorize(request, this.env);
    let user: User | undefined = undefined;
    let sub: string | undefined = undefined;
    if (authorization[0]) {
      sub = authorization[1].authorization.userInfo.sub;
      const kvUser = await this.env.YACHT_USERS.get(
        authorization[1].authorization.userInfo.sub
      );
      if (kvUser) {
        user = JSON.parse(kvUser);
      }
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
      user,
      sub,
    };
    this.sessions[`player${playerIndex}`] = session;

    server.accept();

    if (this.sessions.player1 && this.sessions.player2) {
      const users = [this.sessions.player1.user, this.sessions.player2.user];
      this.send(1, 'start', {
        playerIndex: 1,
        game: this.game,
        users,
      });
      this.send(2, 'start', {
        playerIndex: 2,
        game: this.game,
        users,
      });
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
      this.endGame(playerIndex);
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
          if (this.game.state === 'finished') {
            this.endGame();
          }
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
