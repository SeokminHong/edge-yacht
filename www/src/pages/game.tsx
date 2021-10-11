import styled from '@emotion/styled';

import { GameProvider } from '~contexts/GameContext';
import Board from '~components/Board';

const GamePage = () => {
  return (
    <GameProvider>
      <Board />
    </GameProvider>
  );
};

export default GamePage;
