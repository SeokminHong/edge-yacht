import styled from '@emotion/styled';
import { useContext } from 'react';
import { UPPER_SECTION, LOWER_SECTION, Score, scoreFunctions } from 'shared';

import GameContext from '~contexts/GameContext';

const ScoreRow = ({ score }: { score: keyof Score }) => {
  let { game, playerIndex, select } = useContext(GameContext);
  const { players, boardDices, savedDices, rolled } = game;

  if (!playerIndex) {
    return <></>;
  }

  const scoreValue = players[playerIndex - 1].score[score];
  let calculatedScore = 0;
  if (rolled && scoreValue === null) {
    const allDices = boardDices.concat(savedDices).map((d) => d.value);
    if (score !== 'Bonus') {
      calculatedScore = scoreFunctions[score](allDices) ?? 0;
    }
  }

  return (
    <tr style={{ position: 'relative' }}>
      <OverlayButton
        className={rolled ? 'rolled' : ''}
        onClick={score !== 'Bonus' ? () => select(score) : undefined}
      ></OverlayButton>
      <td>{score}</td>
      <ScoreColumn {...(scoreValue !== null && { className: 'confirmed' })}>
        {scoreValue ?? calculatedScore}
      </ScoreColumn>
    </tr>
  );
};

const OverlayButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;

  &.rolled {
    cursor: pointer;
  }
`;

const ScoreCard = () => {
  return (
    <Table>
      <tbody>
        {UPPER_SECTION.map((s) => (
          <ScoreRow key={`score-${s}`} score={s} />
        ))}
        <ScoreRow score={'Bonus'} />
        {LOWER_SECTION.map((s) => (
          <ScoreRow key={`score-${s}`} score={s} />
        ))}
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  border-collapse: collapse;

  tr,
  td {
    border: 1px black solid;
  }
`;

const ScoreColumn = styled.td`
  min-width: 6em;
  color: silver;

  &.confirmed {
    color: black;
  }
`;

export default ScoreCard;
