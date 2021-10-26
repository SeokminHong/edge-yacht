import { useContext } from 'react';
import { Center, GridItem } from '@chakra-ui/react';

import GameContext from '~contexts/GameContext';

const TotalRow = () => {
  const { game, playerIndex } = useContext(GameContext);
  const { players } = game;
  let total1 = 0;
  let total2 = 0;
  if (playerIndex) {
    total1 = Object.entries(players[0].score).reduce(
      (acc, [, v]) => acc + (v || 0),
      0
    );
    total2 = Object.entries(players[1].score).reduce(
      (acc, [, v]) => acc + (v || 0),
      0
    );
  }
  return (
    <>
      <GridItem gridColumn={1} bg="gray.400" fontWeight="700">
        <Center>Total</Center>
      </GridItem>
      <GridItem gridColumn={2} bg="gray.400" fontWeight="700">
        <Center>{total1}</Center>
      </GridItem>
      <GridItem gridColumn={3} bg="gray.400" fontWeight="700">
        <Center>{total2}</Center>
      </GridItem>
    </>
  );
};

export default TotalRow;
