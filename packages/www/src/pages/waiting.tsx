import { useContext, useEffect } from 'react';
import { Box, Button, useToast } from '@chakra-ui/react';
import { PageProps, navigate } from 'gatsby';
import copy from 'copy-to-clipboard';

import Layout from '~components/Layout';
import GameContext from '~contexts/GameContext';

const Waiting = ({ location }: PageProps) => {
  const { joinSession, closeSession } = useContext(GameContext);
  useEffect(() => {
    joinSession(`/api/join${location.search}`);
  }, [location]);
  const toast = useToast();

  const link = `${location.host}/waiting${location.search}`;

  return (
    <Layout>
      <Box color="gray.500">Share link:</Box>
      <Box color="gray.500">{link}</Box>
      <Button
        onClick={() => {
          copy(link);
          toast({
            title: 'Link copied',
            description: 'Link copied',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }}
      >
        Copy
      </Button>
      <Button
        onClick={() => {
          closeSession();
          navigate('/');
        }}
      >
        Cancel
      </Button>
    </Layout>
  );
};

export default Waiting;
