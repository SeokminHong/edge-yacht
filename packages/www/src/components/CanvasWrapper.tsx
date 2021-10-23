import { Suspense, forwardRef, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import styled from '@emotion/styled';
import { Spinner } from '@chakra-ui/spinner';

import Scene from './Scene';
import { isSSR } from '~utils/window';
import CanvasContext from '~contexts/CanvasContext';

const Fallback = () => <div>Cannot load canvas.</div>;

const CanvasWrapper = forwardRef<
  HTMLDivElement,
  React.RefAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const { dpr } = useContext(CanvasContext);

  return (
    <ErrorBoundary fallback={<Fallback />}>
      <Suspense fallback={Spinner}>
        <div {...props} ref={ref}>
          <Canvas
            mode="concurrent"
            shadows
            gl={{ alpha: false, antialias: true }}
            camera={{ position: [0, 0, 64], fov: 45 }}
            dpr={isSSR ? 1 : dpr}
          >
            <Scene />
            <Html>{children}</Html>
          </Canvas>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
});

CanvasWrapper.displayName = 'CanvasWrapper';

export default styled(CanvasWrapper)`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`;
