import { useContext } from 'react';

import GameContext from '~contexts/GameContext';
import { Player } from '~utils/player';
import { Score } from '~utils/score';

export const usePlayer = (id: PlayerIndex) => {
  const { players, setPlayers } = useContext(GameContext);
  return {
    player: players[id],
    updateScore: (score: Score) =>
      setPlayers(
        Object.values<Player>({
          ...players,
          [id]: {
            ...players[id],
            score,
          },
        })
      ),
  };
};
