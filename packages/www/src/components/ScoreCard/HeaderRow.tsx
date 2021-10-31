import { useContext } from 'react';
import { Center, GridItem, useMediaQuery } from '@chakra-ui/react';
import { User } from 'shared';

import GameContext from '~contexts/GameContext';
import PlayerInfoIcon from '../PlayerInfoIcon';

const HeaderRow = () => {
  const { users, game } = useContext(GameContext);
  const { turn } = game;
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');
  return (
    <>
      <GridItem
        gridColumn={1}
        minW={[100, 100, 200]}
        fontSize={isLargerThan480 ? '3xl' : 'xl'}
      >
        <Center h="100%">Turn</Center>
      </GridItem>
      <GridItem gridColumn={1} fontSize={isLargerThan480 ? '4xl' : '2xl'}>
        <Center h="100%">{turn}/12</Center>
      </GridItem>
      <GridItem bg="gray.400" gridColumn={1}>
        <Center>Categories</Center>
      </GridItem>
      <PlayerInfo column={2} user={users[0]} />
      <PlayerInfo column={3} user={users[1]} />
    </>
  );
};

const PlayerInfo = ({ column, user }: { column: number; user?: User }) => {
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');
  return (
    <>
      <GridItem gridRow="1/3" gridColumn={column} bg="gray.100">
        <Center h="100%">
          <PlayerInfoIcon user={user} size={isLargerThan480 ? 'lg' : 'md'} />
        </Center>
      </GridItem>
      <GridItem minW="128px" bg="green.300" gridRow="3" gridColumn={column}>
        <Center h="100%">{user ? user.nickname : 'Guest'}</Center>
      </GridItem>
    </>
  );
};

export default HeaderRow;
