import { Box } from '@chakra-ui/react';

import Layout from '~components/Layout';
import ScoreCard from '~components/ScoreCard';

const DevPage = () => {
  return (
    <Layout>
      <ScoreCard />
      <Box bg="tomato" w="100%" p={4} color="white">
        This is the Box
      </Box>
    </Layout>
  );
};

export default DevPage;
