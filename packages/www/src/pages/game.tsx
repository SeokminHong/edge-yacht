import styled from '@emotion/styled';
import { useContext } from 'react';

import Board from '~components/Board';
import Layout from '~components/Layout';
import PlayerInfoIcon from '~components/PlayerInfoIcon';
import ScoreCard from '~components/ScoreCard';
import GameContext from '~contexts/GameContext';

const GamePage = () => {
  const { playersInfo } = useContext(GameContext);
  return (
    <Layout>
      <Wrapper>
        {playersInfo.length > 0 && (
          <>
            <div>
              <PlayerInfoIcon playerInfo={playersInfo[0]} size={40} />
            </div>
            <div>
              <PlayerInfoIcon playerInfo={playersInfo[1]} size={40} />
            </div>
          </>
        )}
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
