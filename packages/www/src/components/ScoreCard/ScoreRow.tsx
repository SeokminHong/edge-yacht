import { useContext } from 'react';
import { Center, GridItem, Tooltip } from '@chakra-ui/react';
import { Sections } from 'shared';

import GameContext from '~contexts/GameContext';
import ScoreCell from './ScoreCell';
import localization from '../../locale/en.json';

const ScoreRow = ({ section, idx }: { section: Sections; idx: number }) => {
  const headerColor = idx % 2 === 1 ? 'gray.400' : 'gray.300';
  const currentColor = idx % 2 === 1 ? 'yellow.300' : 'yellow.100';
  const defaultColor = idx % 2 === 1 ? 'gray.300' : undefined;
  const { game } = useContext(GameContext);
  const { currentPlayer } = game;
  return (
    <>
      <Tooltip label={localization.score[section]} aria-label="tooltip">
        <GridItem gridColumn={1} bg={headerColor}>
          <Center>{section}</Center>
        </GridItem>
      </Tooltip>
      <GridItem
        gridColumn={2}
        h="100%"
        bg={currentPlayer === 1 ? currentColor : defaultColor}
      >
        <ScoreCell section={section} index={1} />
      </GridItem>
      <GridItem
        gridColumn={3}
        h="100%"
        bg={currentPlayer === 2 ? currentColor : defaultColor}
      >
        <ScoreCell section={section} index={2} />
      </GridItem>
    </>
  );
};

export default ScoreRow;
