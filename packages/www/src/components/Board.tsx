import { useContext } from 'react';

import GameContext from '~contexts/GameContext';

const Board = () => {
  const { game, saveDice, loadDice, rollDices, playerIndex } =
    useContext(GameContext);
  const { boardDices, savedDices, rollCount, currentPlayer } = game;

  const isCurrentPlayer = playerIndex === currentPlayer;

  return (
    <div>
      {boardDices.map(({ id, value }) => {
        return (
          <div key={`dice-${id}`}>
            {value}
            <button
              disabled={!isCurrentPlayer || rollCount === 0}
              onClick={() => saveDice(id)}
            >
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
            <button
              disabled={!isCurrentPlayer || rollCount === 0}
              onClick={() => loadDice(id)}
            >
              Unsave
            </button>
          </div>
        );
      })}
      <button
        disabled={!isCurrentPlayer || rollCount === 3}
        onClick={rollDices}
      >
        Roll
      </button>
    </div>
  );
};

export default Board;
