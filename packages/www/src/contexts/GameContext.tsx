import { createContext, useState } from 'react';
import { navigate } from 'gatsby';
import { IGame, PlayerIndex, Player, EMPTY_SCORE, Dice } from 'shared';

type Dices = { boardDices: Dice[]; savedDices: Dice[] };

const GameContext = createContext<{
  joinSession: (url: string) => Promise<boolean>;
  closeSession: (code?: number, reason?: string) => void;
  game: IGame;
}>({
  joinSession: async () => false,
  closeSession: () => {},
  game: {
    state: 'waiting',
  },
});
export default GameContext;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [webSocket, setWebsocket] = useState<WebSocket>();
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      score: EMPTY_SCORE,
    },
    {
      id: 2,
      score: EMPTY_SCORE,
    },
  ]);
  const [playerIndex, setPlayerIndex] = useState<PlayerIndex | null>(null);
  const [turn, setTurn] = useState<PlayerIndex>(1);
  const [dices, setDices] = useState<Dices>({
    boardDices: [
      { id: 1, value: 1 },
      { id: 2, value: 1 },
      { id: 3, value: 1 },
      { id: 4, value: 1 },
      { id: 5, value: 1 },
    ],
    savedDices: [],
  });
  const joinSession = async (url: string) => {
    const ws = new WebSocket(url);
    setWebsocket(ws);
    ws.onclose = (e) => {
      if (e.code === 1006) {
        alert(`ws closed abruptly: ${e.reason}`);
      }
    };
    ws.onmessage = (msg) => {
      const { type, payload } = JSON.parse(msg.data);
      switch (type) {
        case 'error': {
          alert(payload.message);
          ws.close();
          navigate('/');
          break;
        }
        case 'start': {
          setPlayerIndex(payload.playerIndex);
          navigate('/game');
          break;
        }
        case 'health': {
          ws.send(
            JSON.stringify({
              type: 'health',
              payload: { index: payload.index },
            })
          );
          break;
        }
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
        players,
        setPlayers,
        turn,
        setTurn,
        dices,
        setDices,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
