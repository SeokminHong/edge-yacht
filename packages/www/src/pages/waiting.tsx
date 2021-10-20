import { PageProps } from 'gatsby';
import { useContext, useEffect } from 'react';

import Layout from '~components/Layout';
import GameContext from '~contexts/GameContext';

const Waiting = ({ location }: PageProps) => {
  const { joinSession, closeSession } = useContext(GameContext);
  useEffect(() => {
    joinSession(`/api/join${location.search}`);
  }, [location]);

  return (
    <Layout>
      <div>Share link:</div>
      <div>{`${location.host}/waiting${location.search}`}</div>
      <button onClick={() => closeSession()}>Cancel</button>
    </Layout>
  );
};

export default Waiting;
