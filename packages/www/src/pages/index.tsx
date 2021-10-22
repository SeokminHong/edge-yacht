import { useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { navigate } from 'gatsby';
import niceColors from 'nice-color-palettes';

import { diceShake, diceRoll } from '~audios';
import OutgameLayout from '~components/OutgameLayout';
import SEO from '~components/SEO';
import LocaleContext from '~contexts/LocaleContext';
import CanvasWrapper from '~meshes/CanvasWrapper';
import Dice from '~meshes/Dice';
import Plane from '~meshes/Plane';
import { locales, isLocale } from '~utils/locale';

const IndexPage = () => {
  const { locale, setLocale } = useContext(LocaleContext);

  return (
    <>
      <SEO title="Home Page" />
      <CanvasWrapper>
        <Canvas
          mode="concurrent"
          shadows
          gl={{ alpha: false, antialias: true }}
          camera={{ position: [0, 0, 64], fov: 45 }}
          dpr={window.devicePixelRatio}
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
            <Dice position={[0, 0, 32]} rotation={[0.15, 1.6, 0]} />
            <Dice position={[-4, 4, 32]} rotation={[1.15, 1, 0]} />
            <Dice position={[4, 4, 32]} rotation={[3, 1.2, 2]} />
            <Dice position={[-4, -4, 32]} rotation={[2, 1.7, 1.5]} />
            <Dice position={[4, -4, 32]} rotation={[1.1, 3, 2.1]} />
          </Physics>
        </Canvas>
      </CanvasWrapper>
      <OutgameLayout>
        <button
          onClick={async () => {
            fetch('/api/create')
              .then((res) => res.json())
              .then((body) => {
                console.log(body);
                return navigate(`/waiting?id=${body.id}`);
              });
          }}
        >
          Create
        </button>
        <select
          onChange={(e) =>
            isLocale(e.target.value) && setLocale(e.target.value)
          }
          value={locale}
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button onClick={() => diceShake.play()}>Shake</button>
        <button onClick={() => diceRoll.play()}>Roll</button>
      </OutgameLayout>
    </>
  );
};

export default IndexPage;
