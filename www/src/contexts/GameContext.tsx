import { createContext, useState } from 'react';

import { Player, ZERO_SCORE } from '~utils/player';

const GameContext = createContext<{
  players: Player[];
  setPlayers: (_: Player[]) => void;
}>({ players: [], setPlayers: () => {} });
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

  return (
    <GameContext.Provider value={{ players, setPlayers }}>
      {children}
    </GameContext.Provider>
  );
};
