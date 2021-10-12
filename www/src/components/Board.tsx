import { useContext } from 'react';

import GameContext from '~contexts/GameContext';
import { Dice, rollDice } from '~utils/dice';

const Board = () => {
  const { dices, setDices } = useContext(GameContext);
  const rollDices = () => {
    const newDices = dices.pending.map(() => rollDice());
    setDices({ ...dices, pending: newDices });
  };
  const SaveDice = (index: number) => {
    const newDices = {
      pending: dices.pending.filter((_, i) => i !== index),
      saved: [...dices.saved, dices.pending[index]],
    };
    setDices(newDices);
  };
  const UnsaveDice = (index: number) => {
    const newDices = {
      pending: [...dices.pending, dices.saved[index]],
      saved: dices.saved.filter((_, i) => i !== index),
    };
    setDices(newDices);
  };

  return (
    <div>
      {dices.pending.map((d, idx) => {
        return (
          <div key={`dice-${idx}`}>
            {d}
            <button onClick={() => SaveDice(idx)}>Save</button>
          </div>
        );
      })}
      <hr />
      {dices.saved.map((d, idx) => {
        return (
          <div key={`saved-${idx}`}>
            {d}
            <button onClick={() => UnsaveDice(idx)}>Unsave</button>
          </div>
        );
      })}
      <button onClick={rollDices}>Roll</button>
    </div>
  );
};

export default Board;
