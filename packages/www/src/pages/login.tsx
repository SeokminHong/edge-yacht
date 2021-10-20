import { useEffect } from 'react';
import { navigate, PageProps } from 'gatsby';

import Layout from '~components/Layout';
import { getAuth } from '~utils/api';

const LoginPage = ({ location }: PageProps) => {
  useEffect(() => {
    fetch(`${getAuth()}/auth${location.search}`, {
      headers: {
        credentials: 'include',
      },
    })
      .then((res) => res.json())
      .then((body) => console.log(body));
    //navigate(`${getAuth()}/auth${location.search}`);
  }, []);

  return (
    <Layout>
      <h1>Logging in...</h1>
    </Layout>
  );
};

export default LoginPage;
