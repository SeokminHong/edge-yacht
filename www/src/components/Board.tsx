import { useContext } from 'react';

import GameContext from '~contexts/GameContext';
import { Dice, rollDice } from '~utils/dice';

const Board = () => {
  const { dices, setDices } = useContext(GameContext);
  const rollDices = () => {
    const newDices = dices.map((d) => {
      const { saved } = d;
      if (!saved) {
        return {
          value: rollDice(),
          saved,
        };
      }
      return d;
    });
    setDices(newDices);
  };
  const handleSave = (index: number, save: boolean) => {
    const v = Object.values<Dice>({
      ...dices,
      [index]: {
        value: dices[index].value,
        saved: save,
      },
    });
    setDices(v);
  };

  return (
    <div>
      <button onClick={rollDices}>Roll</button>
      {dices.map((d, idx) => {
        const { value } = d;
        return (
          <div key={idx}>
            {value}
            <input
              type="checkbox"
              defaultChecked={d.saved}
              onChange={(e) => handleSave(idx, e.target.checked)}
            ></input>
          </div>
        );
      })}
    </div>
  );
};

export default Board;
