import { ReactNode } from 'react';

import { LocaleProvider } from '~contexts/LocaleContext';
import { GameProvider } from '~contexts/GameContext';

interface Props {
  children: ReactNode;
}

const Root = ({ children }: Props) => {
  return (
    <LocaleProvider>
      <GameProvider>{children}</GameProvider>
    </LocaleProvider>
  );
};

export default Root;
