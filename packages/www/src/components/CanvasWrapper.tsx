import { Suspense, useContext, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Canvas } from '@react-three/fiber';
import styled from '@emotion/styled';
import { Spinner } from '@chakra-ui/spinner';

import Scene from './Scene';
import { isSSR } from '~utils/window';
import CanvasContext from '~contexts/CanvasContext';
import GameContext from '~contexts/GameContext';

const Fallback = () => <div>Cannot load canvas.</div>;

const CanvasWrapper = ({
  children,
  ...props
}: React.HTMLProps<HTMLDivElement>) => {
  const { dpr } = useContext(CanvasContext);
  const { game } = useContext(GameContext);
  const [rollIndex, setRollIndex] = useState(0);
  const { rollCount, currentPlayer, boardDice, savedDice } = game;
  useEffect(() => {
    if (rollCount >= 1) {
      setRollIndex((i) => i + 1);
    }
  }, [rollCount, currentPlayer]);

  return (
    <ErrorBoundary fallback={<Fallback />}>
      <Suspense fallback={Spinner}>
        <div {...props}>
          <Canvas
            mode="concurrent"
            shadows
            gl={{ alpha: false, antialias: true }}
            camera={{ position: [0, 0, 96], fov: 45 }}
            dpr={isSSR ? 1 : dpr}
          >
            <Scene
              rollIndex={rollIndex}
              boardDice={boardDice}
              savedDice={savedDice}
            />
          </Canvas>
          {children}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default styled(CanvasWrapper)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;
