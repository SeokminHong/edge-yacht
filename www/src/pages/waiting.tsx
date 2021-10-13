import { PageProps } from 'gatsby';
import { useContext, useEffect } from 'react';

import Layout from '~components/Layout';
import GameContext from '~contexts/GameContext';

const Waiting = ({ location }: PageProps) => {
  const { joinSession } = useContext(GameContext);
  useEffect(() => {
    joinSession(`wss://yacht-api.seokmin.workers.dev/join${location.search}`);
  }, [location]);

  return (
    <Layout>
      Share link:
      {`localhost:8000/waiting${location.search}`}
    </Layout>
  );
};

export default Waiting;
