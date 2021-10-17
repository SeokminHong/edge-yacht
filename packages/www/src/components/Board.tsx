import { useContext } from 'react';

import GameContext from '~contexts/GameContext';

const Board = () => {
  const { game, saveDice, loadDice, rollDices } = useContext(GameContext);
  const { boardDices, savedDices, rolled } = game;

  return (
    <div>
      {boardDices.map(({ id, value }) => {
        return (
          <div key={`dice-${id}`}>
            {value}
            <button {...{ disabled: !rolled }} onClick={() => saveDice(id)}>
              Save
            </button>
          </div>
        );
      })}
      <hr />
      {savedDices.map(({ id, value }) => {
        return (
          <div key={`saved-${id}`}>
            {value}
            <button {...{ disabled: !rolled }} onClick={() => loadDice(id)}>
              Unsave
            </button>
          </div>
        );
      })}
      <button onClick={rollDices}>Roll</button>
    </div>
  );
};

export default Board;
