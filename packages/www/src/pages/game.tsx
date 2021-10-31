import {
  Center,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  IconButton,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import Board from '~components/Board';
import CanvasWrapper from '~components/CanvasWrapper';
import ScoreCard from '~components/ScoreCard';

const GamePage = () => {
  const [isLargerThan960] = useMediaQuery('(min-width: 960px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <CanvasWrapper>
      <Flex p="4" pos="absolute" top="0" left="0" bottom="0" right="0">
        {isLargerThan960 && <ScoreCard />}
        <Center alignSelf="flex-end" flex="1">
          <Board />
        </Center>
      </Flex>
      {!isLargerThan960 && (
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Open scorecard"
          size="lg"
          pos="fixed"
          bottom="4"
          left="4"
          borderRadius="50%"
          boxShadow="lg"
          onClick={onOpen}
        >
          Hello
        </IconButton>
      )}
      <Drawer onClose={onClose} isOpen={isOpen} size="full" placement="left">
        <DrawerContent bg="transparent" h="100%" py="4">
          <DrawerCloseButton color="gray.500" />
          <ScoreCard />
        </DrawerContent>
      </Drawer>
    </CanvasWrapper>
  );
};

export default GamePage;
