import { ReactNode } from 'react';

import { AuthProvider } from '~contexts/AuthContext';
import { CanvasProvider } from '~contexts/CanvasContext';
import { LocaleProvider } from '~contexts/LocaleContext';
import { GameProvider } from '~contexts/GameContext';

interface Props {
  children: ReactNode;
}

const Root = ({ children }: Props) => {
  return (
    <AuthProvider>
      <LocaleProvider>
        <GameProvider>
          <CanvasProvider>{children}</CanvasProvider>
        </GameProvider>
      </LocaleProvider>
    </AuthProvider>
  );
};

export default Root;
