import { createContext, useState } from 'react';
import { defaultDice, Dice } from '~utils/dice';

import { Player, PlayerIndex, ZERO_SCORE } from '~utils/player';

const GameContext = createContext<{
  players: Player[];
  setPlayers: (_: Player[]) => void;
  turn: PlayerIndex;
  setTurn: (_: PlayerIndex) => void;
  dices: Dice[];
  setDices: (_: Dice[]) => void;
}>({
  players: [],
  setPlayers: () => {},
  turn: 1,
  setTurn: () => {},
  dices: [],
  setDices: () => {},
});
export default GameContext;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      score: ZERO_SCORE,
    },
    {
      id: 2,
      score: ZERO_SCORE,
    },
  ]);
  const [turn, setTurn] = useState<PlayerIndex>(1);
  const [dices, setDices] = useState<Dice[]>(Array(5).fill(defaultDice));

  return (
    <GameContext.Provider
      value={{ players, setPlayers, turn, setTurn, dices, setDices }}
    >
      {children}
    </GameContext.Provider>
  );
};
