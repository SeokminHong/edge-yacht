import { useContext } from 'react';
import styled from '@emotion/styled';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import niceColors from 'nice-color-palettes';

import SEO from '~components/SEO';
import LocaleContext from '~contexts/LocaleContext';
import Box from '~fibers/Box';
import Plane from '~fibers/Plane';
import { locales, isLocale } from '~utils/locale';

const IndexPage = () => {
  const { locale, setLocale } = useContext(LocaleContext);

  return (
    <>
      <SEO title="Home Page" />
      <select
        onChange={(e) => isLocale(e.target.value) && setLocale(e.target.value)}
        value={locale}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <CanvasWrapper>
        <Canvas
          mode="concurrent"
          shadows
          gl={{ alpha: false }}
          camera={{ position: [0, 0, 64], fov: 45 }}
        >
          <hemisphereLight intensity={0.35} />
          <spotLight
            position={[30, 0, 30]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize-width={256}
            shadow-mapSize-height={256}
          />
          <pointLight position={[-30, 0, -30]} intensity={0.5} />
          <Physics gravity={[0, 0, -30]}>
            <Plane color={niceColors[17][4]} />
            <Plane
              color={niceColors[17][1]}
              position={[-10, 0, 0]}
              rotation={[0, 0.9, 0]}
              size={[10, 30]}
            />
            <Plane
              color={niceColors[17][2]}
              position={[10, 0, 0]}
              rotation={[0, -0.9, 0]}
              size={[10, 30]}
            />
            <Plane
              color={niceColors[17][3]}
              position={[0, 10, 0]}
              rotation={[0.9, 0, 0]}
              size={[30, 10]}
            />
            <Plane
              color={niceColors[17][0]}
              position={[0, -10, 0]}
              rotation={[-0.9, 0, 0]}
              size={[30, 10]}
            />
            <Box position={[0, 0, 4]} />
            <Box position={[4, 4, 4]} />
            <Box position={[-4, -4, 4]} />
          </Physics>
        </Canvas>
      </CanvasWrapper>
    </>
  );
};

const CanvasWrapper = styled.div`
  height: 300px;
`;

export default IndexPage;
