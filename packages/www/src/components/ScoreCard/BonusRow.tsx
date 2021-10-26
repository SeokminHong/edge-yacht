import { useContext } from 'react';
import { Center, GridItem, Tooltip } from '@chakra-ui/react';
import { UPPER_SECTION } from 'shared';

import GameContext from '~contexts/GameContext';
import localization from '../../locale/en.json';

const BonusRow = () => {
  const { game, playerIndex } = useContext(GameContext);
  const { players } = game;
  let [subtotal1, subtotal2] = [0, 0];
  let bonus1 = null;
  let bonus2 = null;
  if (playerIndex) {
    [subtotal1, subtotal2] = UPPER_SECTION.reduce(
      ([acc1, acc2], s) => [
        acc1 + (players[0].score[s] || 0),
        acc2 + (players[1].score[s] || 0),
      ],
      [0, 0]
    );
    bonus1 = players[0].score.Bonus;
    bonus2 = players[1].score.Bonus;
  }
  return (
    <>
      <GridItem gridColumn={1} fontSize="md" color="gray.500">
        <Center>Subtotal</Center>
      </GridItem>
      <GridItem gridColumn={2} fontSize="md" color="gray.500">
        <Center>{subtotal1}/63</Center>
      </GridItem>
      <GridItem gridColumn={3} fontSize="md" color="gray.500">
        <Center>{subtotal2}/63</Center>
      </GridItem>
      <GridItem gridColumn={1}>
        <Tooltip label={localization.score['Bonus']} aria-label="tooltip">
          <Center>+35 Bonus</Center>
        </Tooltip>
      </GridItem>
      <GridItem gridColumn={2}>
        <Center>{bonus1}</Center>
      </GridItem>
      <GridItem gridColumn={3}>
        <Center>{bonus2}</Center>
      </GridItem>
    </>
  );
};

export default BonusRow;
