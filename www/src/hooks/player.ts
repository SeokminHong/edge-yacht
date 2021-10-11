import { useContext } from 'react';

import GameContext from '~contexts/GameContext';
import { PlayerIndex } from '~utils/player';
import { Score } from '~utils/score';

export const usePlayer = (id: PlayerIndex) => {
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
