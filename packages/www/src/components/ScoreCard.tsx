import styled from '@emotion/styled';
import { useContext } from 'react';
import {
  PlayerIndex,
  UPPER_SECTION,
  LOWER_SECTION,
  Sections,
  scoreFunctions,
} from 'shared';

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

const ScoreCard = () => {
  return (
    <CardWrapper>
      {UPPER_SECTION.map((s) => (
        <ScoreRow key={`row-${s}`} section={s} />
      ))}
      <BonusRow />
      {LOWER_SECTION.map((s) => (
        <ScoreRow key={`row-${s}`} section={s} />
      ))}
      <TotalRow />
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 4em 4em;
  margin: 0;

  & > div {
    height: 2em;
    line-height: 2em;
  }
  & > button:not(:disabled) {
    cursor: pointer;
    :hover {
      background-color: yellow;
    }
  }
  & > .cell {
    padding: 0 16px;
    background: none;
    border: none;
    border-right: 2px solid black;
    border-bottom: 2px solid black;
    font-size: 1rem;
    font-family: sans-serif;
  }
  & > .score {
    text-align: center;
    color: gray;
    &.confirmed {
      color: black;
    }
  }
`;

export default ScoreCard;
