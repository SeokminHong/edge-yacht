import { createContext, useContext, useState } from 'react';
import { navigate } from 'gatsby';
import {
  IGame,
  PlayerIndex,
  DEFAULT_GAME,
  DataType,
  isError,
  isHealth,
  isStart,
  isUpdate,
  isEnd,
  Sections,
  User,
} from 'shared';

import { toWebsocketUrl } from '~utils/api';

const GameContext = createContext<{
  joinSession: (url: string) => Promise<boolean>;
  closeSession: (code?: number, reason?: string) => void;
  playerIndex: PlayerIndex | null;
  users: (User | undefined)[];
  game: IGame;
  saveDice: (diceId: number) => void;
  loadDice: (diceId: number) => void;
  rollDice: () => void;
  select: (section: Sections) => void;
}>({
  joinSession: async () => false,
  closeSession: () => {},
  playerIndex: null,
  users: [],
  game: DEFAULT_GAME,
  saveDice: () => {},
  loadDice: () => {},
  rollDice: () => {},
  select: () => {},
});
export default GameContext;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [webSocket, setWebsocket] = useState<WebSocket>();
  const [playerIndex, setPlayerIndex] = useState<PlayerIndex | null>(null);
  const [game, setGame] = useState(DEFAULT_GAME);
  const [users, setUsers] = useState<(User | undefined)[]>([]);

  const joinSession = async (url: string) => {
    const u = toWebsocketUrl(url);
    const ws = new WebSocket(u);
    setWebsocket(ws);
    ws.addEventListener('close', (e) => {
      if (e.code === 1006) {
        alert(`ws closed abruptly: ${e.reason}`);
      }
    });
    ws.addEventListener('message', (msg) => {
      const data: DataType = JSON.parse(msg.data);
      if (isError(data)) {
        alert(data.payload.message);
        ws.close();
        navigate('/');
      } else if (isHealth(data)) {
        ws.send(
          JSON.stringify({
            type: 'health',
            payload: { index: data.payload.index },
          })
        );
      } else if (isStart(data)) {
        setPlayerIndex(data.payload.playerIndex);
        setGame(data.payload.game);
        setUsers(data.payload.users);
        navigate('/game');
      } else if (isUpdate(data)) {
        setGame(data.payload.game);
      } else if (isEnd(data)) {
        if (data.payload.result === 'win') {
          alert('You win!');
        } else if (data.payload.result === 'lose') {
          alert('You lose!');
        } else {
          alert('Draw!');
        }
        ws.close();
        navigate('/');
      }
    });
    ws.addEventListener('error', (e) => {
      alert(`Websocket error: ${e}`);
    });
    return true;
  };
  const closeSession = (code = 1000, reason?: string) =>
    webSocket && webSocket.close(code, reason);
  const saveDice = (diceId: number) =>
    webSocket &&
    webSocket.send(JSON.stringify({ type: 'save', payload: { diceId } }));
  const loadDice = (diceId: number) =>
    webSocket &&
    webSocket.send(JSON.stringify({ type: 'load', payload: { diceId } }));
  const rollDice = () =>
    webSocket && webSocket.send(JSON.stringify({ type: 'roll' }));
  const select = (section: Sections) =>
    webSocket &&
    webSocket.send(JSON.stringify({ type: 'select', payload: { section } }));

  return (
    <GameContext.Provider
      value={{
        joinSession,
        closeSession,
        playerIndex,
        users,
        game,
        saveDice,
        loadDice,
        rollDice,
        select,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext).game;
