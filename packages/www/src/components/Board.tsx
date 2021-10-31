import { useContext } from 'react';
import {
  Button,
  Center,
  Grid,
  GridItem,
  useMediaQuery,
} from '@chakra-ui/react';

import GameContext from '~contexts/GameContext';

const Board = () => {
  const { game, saveDice, loadDice, rollDice, playerIndex } =
    useContext(GameContext);
  const { boardDice, savedDice, rollCount, currentPlayer } = game;
  const isCurrentPlayer = playerIndex === currentPlayer;

  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');

  return (
    <Grid bg="gray.100">
      {boardDice.map(({ id, value }) => {
        return (
          <>
            <GridItem key={`dice-${id}`} bg="gray.200" gridRow="1">
              <Center py="2">{value}</Center>
            </GridItem>
            <GridItem gridRow="2">
              <Button
                p="2"
                disabled={!isCurrentPlayer || rollCount === 0}
                onClick={() => saveDice(id)}
                fontSize={isLargerThan480 ? 'lg' : 'sm'}
              >
                Save
              </Button>
            </GridItem>
          </>
        );
      })}
      {savedDice.map(({ id, value }) => {
        return (
          <>
            <GridItem key={`saved-${id}`} bg="gray.400" gridRow="1">
              <Center py="2">{value}</Center>
            </GridItem>
            <GridItem gridRow="2">
              <Button
                p="2"
                disabled={!isCurrentPlayer || rollCount === 0}
                onClick={() => loadDice(id)}
                fontSize={isLargerThan480 ? 'lg' : 'sm'}
              >
                Unsave
              </Button>
            </GridItem>
          </>
        );
      })}
      <GridItem
        bg="gray.400"
        {...(isLargerThan480
          ? { rowStart: 1, rowSpan: 2 }
          : { colStart: 1, colSpan: 5, w: '100%' })}
      >
        <Button
          disabled={!isCurrentPlayer || rollCount === 3}
          onClick={rollDice}
          border="none"
          borderRadius="0"
          w="100%"
          h="100%"
          bg="orange.500"
          verticalAlign="none"
        >
          Roll
        </Button>
      </GridItem>
    </Grid>
  );
};

export default Board;
