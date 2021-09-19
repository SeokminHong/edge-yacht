import { ReactNode } from 'react';

import { LocaleProvider } from '~contexts/LocaleContext';

interface Props {
  children: ReactNode;
}

const Root = ({ children }: Props) => {
  return <LocaleProvider>{children}</LocaleProvider>;
};

export default Root;
