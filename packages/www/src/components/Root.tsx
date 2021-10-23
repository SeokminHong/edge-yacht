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
        <CanvasProvider>
          <GameProvider>{children}</GameProvider>
        </CanvasProvider>
      </LocaleProvider>
    </AuthProvider>
  );
};

export default Root;
