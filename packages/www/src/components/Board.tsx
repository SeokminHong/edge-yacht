import { useContext } from 'react';
import { Button, Center, Grid, GridItem } from '@chakra-ui/react';

import GameContext from '~contexts/GameContext';

const Board = () => {
  const { game, saveDice, loadDice, rollDice, playerIndex } =
    useContext(GameContext);
  const { boardDice, savedDice, rollCount, currentPlayer } = game;

  const isCurrentPlayer = playerIndex === currentPlayer;

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
                minW="8ch"
                disabled={!isCurrentPlayer || rollCount === 0}
                onClick={() => saveDice(id)}
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
                minW="8ch"
                disabled={!isCurrentPlayer || rollCount === 0}
                onClick={() => loadDice(id)}
              >
                Unsave
              </Button>
            </GridItem>
          </>
        );
      })}
      <GridItem bg="gray.400" rowStart={1} rowSpan={2}>
        <Button
          disabled={!isCurrentPlayer || rollCount === 3}
          onClick={rollDice}
          border="none"
          h="100%"
          bg="orange.500"
        >
          Roll
        </Button>
      </GridItem>
    </Grid>
  );
};

export default Board;
