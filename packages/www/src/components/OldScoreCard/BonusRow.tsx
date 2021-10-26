import { useContext } from 'react';
import { UPPER_SECTION } from 'shared';

import GameContext from '~contexts/GameContext';

const BonusRow = () => {
  const { game, playerIndex } = useContext(GameContext);
  const { players } = game;
  let [subtotal1, subtotal2] = [0, 0];
  let bonus1 = null;
  let bonus2 = null;
  if (playerIndex) {
    [subtotal1, subtotal2] = UPPER_SECTION.reduce(
      ([acc1, acc2], s) => [
        acc1 + (players[0].score[s] || 0),
        acc2 + (players[1].score[s] || 0),
      ],
      [0, 0]
    );
    bonus1 = players[0].score.Bonus;
    bonus2 = players[1].score.Bonus;
  }
  return (
    <>
      <div className="cell">Subtotal</div>
      <div className="cell">{`${subtotal1}/63`}</div>
      <div className="cell">{`${subtotal2}/63`}</div>
      <div className="cell">+35 Bonus</div>
      <div className="cell score">{bonus1}</div>
      <div className="cell score">{bonus2}</div>
    </>
  );
};

export default BonusRow;
