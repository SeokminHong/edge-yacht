import { navigate } from 'gatsby';
import { Button, Center } from '@chakra-ui/react';

import Layout from '~components/Layout';
import SEO from '~components/SEO';

const IndexPage = () => {
  return (
    <>
      <SEO title="Yacht!" />
      <Layout>
        <Center h="100%">
          <Button
            bg="orange.500"
            fontSize="4xl"
            p="4"
            h="fit-content"
            onClick={async () => {
              fetch('/api/create')
                .then((res) => res.json())
                .then((body) => {
                  return navigate(`/waiting?id=${body.id}`);
                });
            }}
          >
            Create Room
          </Button>
        </Center>
      </Layout>
    </>
  );
};

export default IndexPage;
