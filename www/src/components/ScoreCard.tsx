import styled from '@emotion/styled';

import { usePlayer } from '~hooks/player';
import { UPPER_SECTION, LOWER_SECTION, Score } from '~utils/score';

const ScoreRow = ({ score }: { score: keyof Score }) => {
  const { player } = usePlayer(1);
  return (
    <tr>
      <td>{score}</td>
      <ScoreColumn>{player.score[score]}</ScoreColumn>
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
`;

export default ScoreCard;
