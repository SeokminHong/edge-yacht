import { useContext } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { PlayerIndex, Sections, scoreFunctions } from 'shared';

import GameContext from '~contexts/GameContext';

const ScoreCell = ({
  section,
  index,
}: {
  section: Sections;
  index: PlayerIndex;
}) => {
  const { game, playerIndex, select } = useContext(GameContext);
  const { currentPlayer, players, rollCount, boardDice, savedDice } = game;
  let score = null;
  let predictedScore = null;
  if (playerIndex) {
    score = players[index - 1].score[section];

    const allDice = boardDice.concat(savedDice).map((d) => d.value);
    if (rollCount > 0 && score === null && currentPlayer == index) {
      predictedScore = scoreFunctions[section](allDice);
    }
  }
  const scoreValue =
    score === null ? (predictedScore === null ? '' : predictedScore) : score;
  const className = `cell score${score !== null ? ' confirmed' : ''}`;
  return (
    <Center>
      {index === playerIndex ? (
        <Box
          as="button"
          w="100%"
          h="100%"
          className={className}
          disabled={predictedScore === null}
          onClick={() => select(section)}
        >
          {scoreValue}
        </Box>
      ) : (
        <Box className={className}>{scoreValue}</Box>
      )}
    </Center>
  );
};

export default ScoreCell;
