import { useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from '@emotion/styled';

import SEO from '~components/SEO';
import LocaleContext from '~contexts/LocaleContext';
import Box from '~fibers/Box';
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
