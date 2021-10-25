import { Box, Center, Flex, Grid, GridItem, Tooltip } from '@chakra-ui/react';
// import {} from '@chakra-ui/icons'
import styled from '@emotion/styled';
import { UPPER_SECTION } from 'shared';

import Layout from '~components/Layout';
import PlayerInfoIcon from '~components/PlayerInfoIcon';

const ScoreBoard = () => {
  return (
    <Grid gap={0} bg="gray.100">
      <StyledGridItem bg="yellow.500" gridColumn={1} h="64px" fontSize="3xl">
        <Center h="100%">Turn</Center>
      </StyledGridItem>
      <StyledGridItem bg="red.500" gridColumn={1} h="64px" fontSize="4xl">
        <Center h="100%">1/12</Center>
      </StyledGridItem>
      <StyledGridItem bg="gray.500" gridColumn={1} fontSize="xl">
        Categories
      </StyledGridItem>
      <StyledGridItem gridRow="1/3" gridColumn={2}>
        <Center h="100%">
          <PlayerInfoIcon size={64} />
        </Center>
      </StyledGridItem>
      <StyledGridItem gridRow="1/3" gridColumn={3}>
        <Center h="100%">
          <PlayerInfoIcon size={64} />
        </Center>
      </StyledGridItem>
      <StyledGridItem bg="green.300" gridRow="3" gridColumn={2}>
        <Center h="100%">Player 1</Center>
      </StyledGridItem>
      <StyledGridItem bg="green.900" gridRow="3" gridColumn={3}>
        <Center h="100%">Player 2</Center>
      </StyledGridItem>
      {UPPER_SECTION.map((s) => (
        <StyledGridItem key={`${s}-row`} gridColumn={1}>
          <Tooltip
            label={'detailed explaination for the category'}
            aria-label="tooltip"
          >
            <Flex align="center" justify="end">
              {s}
            </Flex>
          </Tooltip>
        </StyledGridItem>
      ))}
    </Grid>
  );
};

const StyledGridItem = styled(GridItem)`
  padding: 8px;
`;

const DevPage = () => {
  return (
    <Layout>
      <ScoreBoard />
      <Box bg="tomato" w="100%" p={4} color="white">
        This is the Box
      </Box>
    </Layout>
  );
};

export default DevPage;
