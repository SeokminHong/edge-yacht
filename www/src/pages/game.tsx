import styled from '@emotion/styled';

import Board from '~components/Board';
import ScoreCard from '~components/ScoreCard';

const GamePage = () => {
  return (
    <Wrapper>
      <ScoreCard />
      <Board />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  & > * {
    margin: 1rem;
  }
`;

export default GamePage;
