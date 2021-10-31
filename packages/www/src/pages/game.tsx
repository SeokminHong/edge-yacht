import styled from '@emotion/styled';

import Board from '~components/Board';
import CanvasWrapper from '~components/CanvasWrapper';
import Layout from '~components/Layout';
import ScoreCard from '~components/ScoreCard';

const GamePage = () => {
  return (
    <CanvasWrapper>
      <Layout>
        <Wrapper>
          <ScoreCard />
          <Board />
        </Wrapper>
      </Layout>
    </CanvasWrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  padding: 16px;
`;

export default GamePage;
