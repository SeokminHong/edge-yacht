import { PageProps } from 'gatsby';
import { useContext, useEffect } from 'react';

import Layout from '~components/Layout';
import GameContext from '~contexts/GameContext';

const Waiting = ({ location }: PageProps) => {
  const { joinSession } = useContext(GameContext);
  useEffect(() => {
    joinSession(
      `wss://yacht-api.seokmin.workers.dev/join${location.search}`
    ).then((success) => {
      console.log(success ? `success` : `failed`);
    });
  }, [location]);

  return (
    <Layout>
      <div>Share link:</div>
      <div>{`localhost:8000/waiting${location.search}`}</div>
    </Layout>
  );
};

export default Waiting;
