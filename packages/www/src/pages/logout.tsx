import { useContext, useEffect } from 'react';
import { navigate } from 'gatsby';

import Layout from '~components/Layout';
import AuthContext from '~contexts/AuthContext';

const LogoutPage = () => {
  const { setUser } = useContext(AuthContext);
  useEffect(() => {
    setUser(null);
    navigate('/');
  }, []);

  return (
    <Layout>
      <h1>You are now logged out</h1>
    </Layout>
  );
};

export default LogoutPage;
