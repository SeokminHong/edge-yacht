import { ReactNode } from 'react';

import { AuthPovider } from '~contexts/AuthContext';
import { LocaleProvider } from '~contexts/LocaleContext';
import { GameProvider } from '~contexts/GameContext';

interface Props {
  children: ReactNode;
}

const Root = ({ children }: Props) => {
  return (
    <AuthPovider>
      <LocaleProvider>
        <GameProvider>{children}</GameProvider>
      </LocaleProvider>
    </AuthPovider>
  );
};

export default Root;
