import { Grid, GridItem } from '@chakra-ui/react';
import { UPPER_SECTION, LOWER_SECTION } from 'shared';

import BonusRow from './BonusRow';
import HeaderRow from './HeaderRow';
import ScoreRow from './ScoreRow';
import TotalRow from './TotalRow';

const ScoreCard = () => {
  return (
    <Grid gap={0} bg="gray.100" maxW="480px" fontSize="xl">
      <HeaderRow />
      {UPPER_SECTION.map((s, idx) => (
        <ScoreRow key={`${s}-row`} section={s} idx={idx} />
      ))}
      <GridItem colSpan={3} h="2" />
      <BonusRow />
      <GridItem colSpan={3} h="2" />
      {LOWER_SECTION.map((s, idx) => (
        <ScoreRow key={`${s}-row`} section={s} idx={idx + 1} />
      ))}
      <TotalRow />
    </Grid>
  );
};

export default ScoreCard;
