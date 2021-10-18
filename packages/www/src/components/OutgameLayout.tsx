import { ReactNode, useContext } from 'react';

import Layout from './Layout';
import AuthContext from '~contexts/AuthContext';
import { getAuth } from '~utils/api';

const OutgameLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      {user ? (
        <span>
          <img src={user.picture} />
          {user.nickname}
          <a href={`${getAuth()}/logout`}>Logout</a>
        </span>
      ) : (
        <a href={`${getAuth()}/login`}>Log in</a>
      )}
      {children}
    </Layout>
  );
};

export default OutgameLayout;
