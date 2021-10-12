import { PageProps } from 'gatsby';
import { useEffect, useRef } from 'react';

import Layout from '~components/Layout';
import { PlayerIndex } from '~utils/player';

const Waiting = ({ location }: PageProps) => {
  const playerIndex = useRef<null | PlayerIndex>(null);
  useEffect(() => {
    const ws = new WebSocket(
      `wss://yacht-api.seokmin.workers.dev/join${location.search}`
    );
    ws.addEventListener('open', (event) => {
      const check = () => {
        if (playerIndex.current === null) {
          ws.send(JSON.stringify({ type: 'waiting' }));
          setTimeout(check, 1000);
        }
      };
      check();
    });
    ws.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'start') {
        playerIndex.current = data.payload.playerIndex;
      }
    });
  }, [location]);

  return (
    <Layout>
      {playerIndex.current
        ? `Player Index: ${playerIndex.current}`
        : `Share link: localhost:8000/waiting${location.search}`}
    </Layout>
  );
};

export default Waiting;
