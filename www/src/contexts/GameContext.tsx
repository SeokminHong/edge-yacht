import { createContext, useState } from 'react';
import { defaultDice, Dice } from '~utils/dice';

import { Player, EMPTY_SCORE } from '~utils/player';

type Dices = { pending: Dice[]; saved: Dice[] };

const GameContext = createContext<{
  joinSession: (url: string) => Promise<boolean>;
  players: Player[];
  setPlayers: (_: Player[]) => void;
  turn: PlayerIndex;
  setTurn: (_: PlayerIndex) => void;
  dices: Dices;
  setDices: (_: Dices) => void;
}>({
  joinSession: async () => false,
  players: [],
  setPlayers: () => {},
  turn: 1,
  setTurn: () => {},
  dices: { pending: [], saved: [] },
  setDices: () => {},
});
export default GameContext;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [websocket, setWebsocket] = useState<WebSocket>();
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
  const [turn, setTurn] = useState<PlayerIndex>(1);
  const [dices, setDices] = useState<Dices>({
    pending: Array(5).fill(defaultDice),
    saved: [],
  });
  const joinSession = async (url: string) => {
    const ws = new WebSocket(url);
    ws.onclose = (e) => {
      if (e.code === 1006) {
        alert(`ws closed abruptly: ${e.reason}`);
      }
    };
    ws.addEventListener('message', (msg) => {
      const { type, payload } = JSON.parse(msg.data);
      switch (type) {
        case 'error': {
          console.log(payload.message);
          ws.close();
        }
        case 'start': {
          console.log(payload.playerIndex);
          //setPlayerIndex(data.payload.playerIndex);
          break;
        }
        case 'health': {
          ws.send(
            JSON.stringify({
              type: 'health',
              payload: { index: payload.index },
            })
          );
        }
      }
    });
    setWebsocket(ws);
    return true;
  };

  return (
    <GameContext.Provider
      value={{
        joinSession,
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
