import { useContext } from 'react';

import GameContext from '~contexts/GameContext';
import { Score } from '~utils/score';

export const usePlayer = (id: 1 | 2) => {
  const { players, setPlayers } = useContext(GameContext);
  return {
    player: players[id],
    updateScore: (score: Score) =>
      setPlayers({
        ...players,
        [id]: {
          ...players[id],
          score,
        },
      }),
  };
};
