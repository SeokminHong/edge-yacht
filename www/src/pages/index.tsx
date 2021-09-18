import { Canvas } from '@react-three/fiber';
import styled from '@emotion/styled';

import Box from '../fiber/Box';

const IndexPage = () => {
  return (
    <>
      <title>Home Page</title>
      <CanvasWrapper>
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
      </CanvasWrapper>
    </>
  );
};

const CanvasWrapper = styled.div`
  height: 300px;
`;

export default IndexPage;
