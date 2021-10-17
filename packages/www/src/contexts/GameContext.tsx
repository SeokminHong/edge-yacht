import { createContext, useState } from 'react';
import { navigate } from 'gatsby';
import {
  IGame,
  PlayerIndex,
  DEFAULT_GAME,
  DataType,
  isError,
  isHealth,
  isStart,
} from 'shared';

const GameContext = createContext<{
  joinSession: (url: string) => Promise<boolean>;
  closeSession: (code?: number, reason?: string) => void;
  playerIndex: PlayerIndex | null;
  game: IGame;
}>({
  joinSession: async () => false,
  closeSession: () => {},
  playerIndex: null,
  game: DEFAULT_GAME,
});
export default GameContext;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [webSocket, setWebsocket] = useState<WebSocket>();
  const [playerIndex, setPlayerIndex] = useState<PlayerIndex | null>(null);
  const [game, setGame] = useState(DEFAULT_GAME);

  const joinSession = async (url: string) => {
    const ws = new WebSocket(url);
    setWebsocket(ws);
    ws.onclose = (e) => {
      if (e.code === 1006) {
        alert(`ws closed abruptly: ${e.reason}`);
      }
    };
    ws.onmessage = (msg) => {
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
      }
    };
    return true;
  };
  const closeSession = (code: number = 1000, reason?: string) =>
    webSocket && webSocket.close(code, reason);

  return (
    <GameContext.Provider
      value={{
        joinSession,
        closeSession,
        playerIndex,
        game,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
