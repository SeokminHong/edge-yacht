import { useContext } from 'react';
import { Box, Button, Center, Divider } from '@chakra-ui/react';

import GameContext from '~contexts/GameContext';

const Board = () => {
  const { game, saveDice, loadDice, rollDice, playerIndex } =
    useContext(GameContext);
  const { boardDice, savedDice, rollCount, currentPlayer } = game;

  const isCurrentPlayer = playerIndex === currentPlayer;

  return (
    <Box bg="gray.100">
      {boardDice.map(({ id, value }) => {
        return (
          <Box key={`dice-${id}`} bg="gray.200">
            <Center p="2" display="inline-block">
              {value}
            </Center>
            <Button
              p="2"
              disabled={!isCurrentPlayer || rollCount === 0}
              onClick={() => saveDice(id)}
            >
              Save
            </Button>
          </Box>
        );
      })}
      <Divider />
      {savedDice.map(({ id, value }) => {
        return (
          <Box key={`saved-${id}`} bg="gray.400">
            <Center p="2" display="inline-block">
              {value}
            </Center>
            <Button
              p="2"
              disabled={!isCurrentPlayer || rollCount === 0}
              onClick={() => loadDice(id)}
            >
              Unsave
            </Button>
          </Box>
        );
      })}
      <Button disabled={!isCurrentPlayer || rollCount === 3} onClick={rollDice}>
        Roll
      </Button>
    </Box>
  );
};

export default Board;
