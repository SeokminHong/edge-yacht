import { useContext } from 'react';

import GameContext from '~contexts/GameContext';

const TotalRow = () => {
  const { game, playerIndex } = useContext(GameContext);
  const { players } = game;
  let total1 = 0;
  let total2 = 0;
  if (playerIndex) {
    total1 = Object.entries(players[0].score).reduce(
      (acc, [, v]) => acc + (v || 0),
      0
    );
    total2 = Object.entries(players[1].score).reduce(
      (acc, [, v]) => acc + (v || 0),
      0
    );
  }

  return (
    <>
      <div className="cell">Total</div>
      <div className="cell score">{total1}</div>
      <div className="cell score">{total2}</div>
    </>
  );
};

export default TotalRow;
