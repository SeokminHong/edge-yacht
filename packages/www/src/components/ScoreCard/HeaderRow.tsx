import { useContext } from 'react';
import { Center, GridItem } from '@chakra-ui/react';
import { User } from 'shared';

import GameContext from '~contexts/GameContext';
import PlayerInfoIcon from '../PlayerInfoIcon';

const HeaderRow = () => {
  const { users, game } = useContext(GameContext);
  const { turn } = game;
  return (
    <>
      <GridItem gridColumn={1} minW={[100, 100, 200]} fontSize="3xl">
        <Center h="100%">Turn</Center>
      </GridItem>
      <GridItem gridColumn={1} fontSize="4xl">
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
  return (
    <>
      <GridItem gridRow="1/3" gridColumn={column}>
        <Center h="100%">
          <PlayerInfoIcon user={user} size="lg" />
        </Center>
      </GridItem>
      <GridItem w="128px" bg="green.300" gridRow="3" gridColumn={column}>
        <Center h="100%">{user ? user.nickname : 'Guest'}</Center>
      </GridItem>
    </>
  );
};

export default HeaderRow;
