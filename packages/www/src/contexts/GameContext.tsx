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
  Sections,
} from 'shared';

const GameContext = createContext<{
  joinSession: (url: string) => Promise<boolean>;
  closeSession: (code?: number, reason?: string) => void;
  playerIndex: PlayerIndex | null;
  game: IGame;
  saveDice: (diceId: number) => void;
  loadDice: (diceId: number) => void;
  rollDices: () => void;
  select: (section: Sections) => void;
}>({
  joinSession: async () => false,
  closeSession: () => {},
  playerIndex: null,
  game: DEFAULT_GAME,
  saveDice: () => {},
  loadDice: () => {},
  rollDices: () => {},
  select: () => {},
});
export default GameContext;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [webSocket, setWebsocket] = useState<WebSocket>();
  const [playerIndex, setPlayerIndex] = useState<PlayerIndex | null>(null);
  const [game, setGame] = useState(DEFAULT_GAME);

  const joinSession = async (url: string) => {
    const ws = new WebSocket(url);
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
        navigate('/game');
      } else if (isUpdate(data)) {
        setGame(data.payload.game);
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
  const rollDices = () =>
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
        game,
        saveDice,
        loadDice,
        rollDices,
        select,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext).game;
