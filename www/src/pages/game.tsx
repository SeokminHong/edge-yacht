import styled from '@emotion/styled';

import { GameProvider } from '~contexts/GameContext';
import Board from '~components/Board';
import ScoreCard from '~components/ScoreCard';

const GamePage = () => {
  return (
    <GameProvider>
      <Wrapper>
        <ScoreCard />
        <Board />
      </Wrapper>
    </GameProvider>
  );
};

const Wrapper = styled.div`
  display: flex;
  & > * {
    margin: 1rem;
  }
`;

export default GamePage;
