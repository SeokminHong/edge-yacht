import { useContext } from 'react';
import { PlayerIndex, Sections, scoreFunctions } from 'shared';

import GameContext from '~contexts/GameContext';

const ScoreCell = ({
  section,
  index,
}: {
  section: Sections;
  index: PlayerIndex;
}) => {
  const { game, playerIndex, select } = useContext(GameContext);
  const { currentPlayer, players, rollCount, boardDices, savedDices } = game;
  let score = null;
  let predictedScore = null;
  if (playerIndex) {
    score = players[index - 1].score[section];

    const allDices = boardDices.concat(savedDices).map((d) => d.value);
    if (rollCount > 0 && score === null && currentPlayer == index) {
      predictedScore = scoreFunctions[section](allDices);
    }
  }
  const scoreValue =
    score === null ? (predictedScore === null ? '' : predictedScore) : score;
  const className = `cell score${score !== null ? ' confirmed' : ''}`;
  return index === playerIndex ? (
    <button
      className={className}
      disabled={predictedScore === null}
      onClick={() => select(section)}
    >
      {scoreValue}
    </button>
  ) : (
    <div className={className}>{scoreValue}</div>
  );
};

const ScoreRow = ({ section }: { section: Sections }) => {
  return (
    <>
      <div className="cell">{section}</div>
      <ScoreCell section={section} index={1} />
      <ScoreCell section={section} index={2} />
    </>
  );
};

export default ScoreRow;
