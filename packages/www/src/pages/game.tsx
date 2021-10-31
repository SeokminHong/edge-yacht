import { Box, Flex } from '@chakra-ui/react';

import Board from '~components/Board';
import CanvasWrapper from '~components/CanvasWrapper';
import ScoreCard from '~components/ScoreCard';

const GamePage = () => {
  return (
    <CanvasWrapper>
      <Flex p="4" pos="absolute" top="0" left="0">
        <ScoreCard />
        <Board />
      </Flex>
    </CanvasWrapper>
  );
};

export default GamePage;
