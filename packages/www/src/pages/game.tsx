import styled from '@emotion/styled';

import Board from '~components/Board';
import Layout from '~components/Layout';
import ScoreCard from '~components/ScoreCard';

const GamePage = () => {
  return (
    <Layout>
      <Wrapper>
        <ScoreCard />
        <Board />
      </Wrapper>
    </Layout>
  );
};

const Wrapper = styled.div`
  display: flex;
  padding: 16px;
`;

export default GamePage;
