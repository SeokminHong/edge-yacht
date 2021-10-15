import { PageProps } from 'gatsby';
import { useContext, useEffect } from 'react';

import Layout from '~components/Layout';
import GameContext from '~contexts/GameContext';
import { getApi } from '~utils/api';

const Waiting = ({ location }: PageProps) => {
  const { joinSession, closeSession } = useContext(GameContext);
  useEffect(() => {
    joinSession(`${getApi('websocket')}/join${location.search}`).then(
      (success) => {
        console.log(success ? `success` : `failed`);
      }
    );
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
