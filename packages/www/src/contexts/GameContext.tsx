import { createContext, useState } from 'react';
import { navigate } from 'gatsby';
import { PlayerIndex } from 'shared';

import { defaultDice, Dice } from '~utils/dice';
import { Player, EMPTY_SCORE } from '~utils/player';

type T = {};
type Dices = { pending: Dice[]; saved: Dice[] };

const GameContext = createContext<{
  joinSession: (url: string) => Promise<boolean>;
  closeSession: (code?: number, reason?: string) => void;
  players: Player[];
  setPlayers: (_: Player[]) => void;
  turn: PlayerIndex;
  setTurn: (_: PlayerIndex) => void;
  dices: Dices;
  setDices: (_: Dices) => void;
}>({
  joinSession: async () => false,
  closeSession: () => {},
  players: [],
  setPlayers: () => {},
  turn: 1,
  setTurn: () => {},
  dices: { pending: [], saved: [] },
  setDices: () => {},
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
    pending: Array(5).fill(defaultDice),
    saved: [],
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
