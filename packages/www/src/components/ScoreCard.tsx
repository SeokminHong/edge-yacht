import styled from '@emotion/styled';
import { useContext } from 'react';
import GameContext from '~contexts/GameContext';

import { usePlayer } from '~hooks/player';
import { DiceNumber } from '~utils/dice';
import {
  UPPER_SECTION,
  LOWER_SECTION,
  Score,
  scoreFunctions,
} from '~utils/score';

const ScoreRow = ({ score }: { score: keyof Score }) => {
  const { player } = usePlayer(1);
  const { dices } = useContext(GameContext);

  let scoreValue = player.score[score];
  const confirmed = scoreValue !== null;
  if (scoreValue === null) {
    const allDices = dices.pending.concat(dices.saved);
    if (!allDices.includes(null)) {
      if (score !== 'Bonus') {
        scoreValue = scoreFunctions[score](allDices as DiceNumber[]);
      }
    }
  }

  return (
    <tr>
      <td>{score}</td>
      <ScoreColumn {...(confirmed && { className: 'confirmed' })}>
        {player.score[score] || scoreValue}
      </ScoreColumn>
    </tr>
  );
};

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
