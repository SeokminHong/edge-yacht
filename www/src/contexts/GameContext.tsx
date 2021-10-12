import { createContext, useState } from 'react';
import { defaultDice, Dice } from '~utils/dice';

import { Player, PlayerIndex, EMPTY_SCORE } from '~utils/player';

type Dices = { pending: Dice[]; saved: Dice[] };

const GameContext = createContext<{
  players: Player[];
  setPlayers: (_: Player[]) => void;
  turn: PlayerIndex;
  setTurn: (_: PlayerIndex) => void;
  dices: Dices;
  setDices: (_: Dices) => void;
}>({
  players: [],
  setPlayers: () => {},
  turn: 1,
  setTurn: () => {},
  dices: { pending: [], saved: [] },
  setDices: () => {},
});
export default GameContext;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <GameContext.Provider
      value={{
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
