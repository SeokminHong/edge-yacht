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
    const res = await fetch(url, {
      headers: {
        Upgrade: 'websocket',
      },
    });
    if (!res.ok || !res.webSocket) {
      alert(`Cannot establish session: ${res.body}`);
      return false;
    }
    const ws = res.webSocket;
    ws.onclose = (e) => {
      if (e.code === 1006) {
        alert(`ws closed abruptly: ${e.reason}`);
      }
    };
    ws.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'start') {
        console.log(data.payload.playerIndex);
        //setPlayerIndex(data.payload.playerIndex);
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
