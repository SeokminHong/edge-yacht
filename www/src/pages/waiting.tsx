import { PageProps } from 'gatsby';
import { useContext, useEffect } from 'react';

import Layout from '~components/Layout';
import GameContext from '~contexts/GameContext';

const Waiting = ({ location }: PageProps) => {
  const { joinSession } = useContext(GameContext);
  useEffect(() => {
    joinSession(
      `https://yacht-api.seokmin.workers.dev/join${location.search}`
    ).then((success) => {
      console.log(success ? `success` : `failed`);
    });
  }, [location]);

  return (
    <Layout>
      Share link:
      {`localhost:8000/waiting${location.search}`}
    </Layout>
  );
};

export default Waiting;
