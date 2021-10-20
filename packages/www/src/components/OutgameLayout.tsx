import { ReactNode, useContext } from 'react';

import Layout from './Layout';
import AuthContext from '~contexts/AuthContext';

const OutgameLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      {user ? (
        <span>
          <img src={user.picture} />
          {user.nickname}
          <a href={`/api/logout`}>Logout</a>
        </span>
      ) : (
        <a href={`/api/login`}>Log in</a>
      )}
      {children}
    </Layout>
  );
};

export default OutgameLayout;
