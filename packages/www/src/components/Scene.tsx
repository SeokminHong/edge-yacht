import { Physics } from '@react-three/cannon';
import niceColors from 'nice-color-palettes';

import Dice from '~meshes/Dice';
import Plane from '~meshes/Plane';

const Scene = () => {
  return (
    <>
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
    </>
  );
};

export default Scene;
