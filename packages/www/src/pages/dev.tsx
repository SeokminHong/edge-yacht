import { Box, Grid, GridItem } from '@chakra-ui/react';

import Layout from '~components/Layout';

const ScoreBoard = () => {
  return (
    <Grid
      templateRows={`repeat(5, 1fr)`}
      templateColumns="repeat(5, 1fr)"
      gap={0}
      bg="gray.100"
    >
      <GridItem bg="yellow.500" rowSpan={2} gridColumn="1/4">
        Turn
      </GridItem>
      <GridItem bg="red.500" rowSpan={2} gridColumn="1/4">
        1 / 12
      </GridItem>
      <GridItem bg="gray.500" rowSpan={1} gridColumn="1/4">
        Categories
      </GridItem>
      <GridItem bg="green.300" gridRow="1/6" gridColumn={4}>
        player1
      </GridItem>
      <GridItem bg="green.900" gridRow="1/6" gridColumn={5}>
        player2
      </GridItem>
    </Grid>
  );
};

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
