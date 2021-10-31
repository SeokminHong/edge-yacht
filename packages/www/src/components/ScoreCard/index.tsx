import { Grid, GridItem, useMediaQuery } from '@chakra-ui/react';
import { UPPER_SECTION, LOWER_SECTION } from 'shared';

import BonusRow from './BonusRow';
import HeaderRow from './HeaderRow';
import ScoreRow from './ScoreRow';
import TotalRow from './TotalRow';

const ScoreCard = () => {
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');
  return (
    <Grid
      gap={0}
      bg="gray.100"
      maxW="480px"
      fontSize={isLargerThan480 ? 'xl' : 'md'}
      h="100%"
      overflow="auto"
    >
      <HeaderRow />
      {UPPER_SECTION.map((s, idx) => (
        <ScoreRow key={`${s}-row`} section={s} idx={idx} />
      ))}
      {isLargerThan480 && <GridItem colSpan={3} h="2" bg="gray.100" />}
      <BonusRow />
      {isLargerThan480 && <GridItem colSpan={3} h="2" bg="gray.100" />}
      {LOWER_SECTION.map((s, idx) => (
        <ScoreRow key={`${s}-row`} section={s} idx={idx + 1} />
      ))}
      <TotalRow />
    </Grid>
  );
};

export default ScoreCard;
