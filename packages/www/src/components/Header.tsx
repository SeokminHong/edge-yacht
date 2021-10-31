import { useContext } from 'react';
import { Avatar, Box, Button, Center, Flex, Icon } from '@chakra-ui/react';
import { BsDice3 } from 'react-icons/bs';
import { navigate } from 'gatsby';

import AuthContext from '~contexts/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Box>
        <Button
          aria-label="Go Home"
          onClick={() => navigate('/')}
          bg="transparent"
          _hover={{ bg: 'transparent' }}
          color="white"
          className="header-button"
          fontSize="6xl"
          p="0"
          h="fit-content"
        >
          <Icon as={BsDice3} mr="4" />
          Yacht!
        </Button>
      </Box>
      <Flex justify="flex-end">
        {user ? (
          <Center>
            <Avatar src={user.picture} />
            <Box color="gray.400" px="4">
              <Box>{user.nickname}</Box>
              <Box>Wins: {user.wins}</Box>
            </Box>
            <Button as="a" href={`/api/logout`}>
              Logout
            </Button>
          </Center>
        ) : (
          <Button as="a" href={`/api/login`}>
            Log in
          </Button>
        )}
      </Flex>
    </>
  );
};

export default Header;
