import { useContext } from 'react';

import GameContext from '~contexts/GameContext';

const Board = () => {
  const { game, saveDice, loadDice, rollDice, playerIndex } =
    useContext(GameContext);
  const { boardDice, savedDice, rollCount, currentPlayer } = game;

  const isCurrentPlayer = playerIndex === currentPlayer;

  return (
    <div>
      {boardDice.map(({ id, value }) => {
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
      {savedDice.map(({ id, value }) => {
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
      <button disabled={!isCurrentPlayer || rollCount === 3} onClick={rollDice}>
        Roll
      </button>
    </div>
  );
};

export default Board;
