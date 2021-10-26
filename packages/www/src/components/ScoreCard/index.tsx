import { useContext } from 'react';
import { Center, Grid, GridItem, Tooltip } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { UPPER_SECTION, LOWER_SECTION, User, Sections } from 'shared';

import GameContext from '~contexts/GameContext';
import localization from '../../locale/en.json';
import PlayerInfoIcon from '../PlayerInfoIcon';
import ScoreCell from './ScoreCell';

const ScoreCard = () => {
  const { users, game } = useContext(GameContext);
  const { turn } = game;
  return (
    <Grid gap={0} bg="gray.100" maxW="480px" fontSize="xl">
      <StyledGridItem gridColumn={1} minW="200px" fontSize="3xl">
        <Center h="100%">Turn</Center>
      </StyledGridItem>
      <StyledGridItem gridColumn={1} fontSize="4xl">
        <Center h="100%">{turn}/12</Center>
      </StyledGridItem>
      <StyledGridItem bg="gray.400" gridColumn={1}>
        <Center>Categories</Center>
      </StyledGridItem>
      <PlayerInfo column={2} user={users[0]} />
      <PlayerInfo column={3} user={users[1]} />
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

const PlayerInfo = ({ column, user }: { column: number; user?: User }) => {
  return (
    <>
      <StyledGridItem gridRow="1/3" gridColumn={column}>
        <Center h="100%">
          <PlayerInfoIcon user={user} size="lg" />
        </Center>
      </StyledGridItem>
      <StyledGridItem w="128px" bg="green.300" gridRow="3" gridColumn={column}>
        <Center h="100%">{user ? user.nickname : 'Guest'}</Center>
      </StyledGridItem>
    </>
  );
};

const ScoreRow = ({ section, idx }: { section: Sections; idx: number }) => {
  const bg = idx % 2 === 1 ? 'gray.300' : undefined;
  return (
    <>
      <Tooltip label={localization.score[section]} aria-label="tooltip">
        <StyledGridItem gridColumn={1} bg={bg}>
          <Center>{section}</Center>
        </StyledGridItem>
      </Tooltip>
      <StyledGridItem gridColumn={2} bg={bg}>
        <ScoreCell section={section} index={1} />
      </StyledGridItem>
      <StyledGridItem gridColumn={3} bg={bg}>
        <ScoreCell section={section} index={2} />
      </StyledGridItem>
    </>
  );
};

const BonusRow = () => {
  const { game, playerIndex } = useContext(GameContext);
  const { players } = game;
  let [subtotal1, subtotal2] = [0, 0];
  let bonus1 = null;
  let bonus2 = null;
  if (playerIndex) {
    [subtotal1, subtotal2] = UPPER_SECTION.reduce(
      ([acc1, acc2], s) => [
        acc1 + (players[0].score[s] || 0),
        acc2 + (players[1].score[s] || 0),
      ],
      [0, 0]
    );
    bonus1 = players[0].score.Bonus;
    bonus2 = players[1].score.Bonus;
  }
  return (
    <>
      <StyledGridItem gridColumn={1} fontSize="md" color="gray.500">
        <Center>Subtotal</Center>
      </StyledGridItem>
      <StyledGridItem gridColumn={2} fontSize="md" color="gray.500">
        <Center>{subtotal1}/63</Center>
      </StyledGridItem>
      <StyledGridItem gridColumn={3} fontSize="md" color="gray.500">
        <Center>{subtotal2}/63</Center>
      </StyledGridItem>
      <StyledGridItem gridColumn={1}>
        <Tooltip label={localization.score['Bonus']} aria-label="tooltip">
          <Center>+35 Bonus</Center>
        </Tooltip>
      </StyledGridItem>
      <StyledGridItem gridColumn={2}>
        <Center>{bonus1}</Center>
      </StyledGridItem>
      <StyledGridItem gridColumn={3}>
        <Center>{bonus2}</Center>
      </StyledGridItem>
    </>
  );
};

const TotalRow = () => {
  const { game, playerIndex } = useContext(GameContext);
  const { players } = game;
  let total1 = 0;
  let total2 = 0;
  if (playerIndex) {
    total1 = Object.entries(players[0].score).reduce(
      (acc, [, v]) => acc + (v || 0),
      0
    );
    total2 = Object.entries(players[1].score).reduce(
      (acc, [, v]) => acc + (v || 0),
      0
    );
  }
  return (
    <>
      <StyledGridItem gridColumn={1} bg="gray.400" fontWeight="700">
        <Center>Total</Center>
      </StyledGridItem>
      <StyledGridItem gridColumn={2} bg="gray.400" fontWeight="700">
        <Center>{total1}</Center>
      </StyledGridItem>
      <StyledGridItem gridColumn={3} bg="gray.400" fontWeight="700">
        <Center>{total2}</Center>
      </StyledGridItem>
    </>
  );
};

const StyledGridItem = styled(GridItem)`
  padding: 4px;
`;

export default ScoreCard;
