import { Canvas } from '@react-three/fiber';
import styled from '@emotion/styled';

import SEO from '~components/SEO';
import Box from '~fibers/Box';

const IndexPage = () => {
  return (
    <>
      <SEO title="Home Page" />
      <div data-i18n-key="index-greet">Hello</div>
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
