import { useContext } from 'react';
import { PlayerIndex, Player, Score } from 'shared';

import GameContext from '~contexts/GameContext';

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
