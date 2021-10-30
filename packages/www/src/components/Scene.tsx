import { useState } from 'react';
import { Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import niceColors from 'nice-color-palettes';

import Board from '~meshes/Board';
import Dice from '~meshes/Dice';
import Plane from '~meshes/Plane';

import dice4 from '~data/dice_4.json';
import dice5 from '~data/dice_5.json';

type Transform = {
  position: [number, number, number];
  quaternion: Quaternion;
};

const ZERO_TRANSFORM: Transform = {
  position: [0, 0, 0],
  quaternion: new Quaternion(0, 0, 0, 1),
};

type Timestamp = {
  elapsed: number;
  index: number;
  transforms: Transform[];
};

const offsetToQuaternion = ({
  qx,
  qy,
  qz,
  qw,
}: {
  qx: number;
  qy: number;
  qz: number;
  qw: number;
}) => new Quaternion(qx, qy, qz, qw);

const Scene = () => {
  const [timestamp, setTimestamp] = useState<Timestamp>({
    elapsed: 0,
    index: 0,
    transforms: [
      ZERO_TRANSFORM,
      ZERO_TRANSFORM,
      ZERO_TRANSFORM,
      ZERO_TRANSFORM,
      ZERO_TRANSFORM,
    ],
  });
  useFrame((s, delta) => {
    const elapsed = timestamp.elapsed + delta;
    for (let i = timestamp.index; i < dice5.timestamps.length; i++) {
      if (elapsed > dice5.timestamps[i].time) {
        continue;
      }
      setTimestamp({
        elapsed,
        index: i,
        transforms: dice5.timestamps[i].tf.map((tf, i) => ({
          position: [tf.x, tf.y, tf.z],
          quaternion: offsetToQuaternion(dice5.offsets[i][5]).multiply(
            new Quaternion(tf.qx, tf.qy, tf.qz, tf.qw)
          ),
        })),
      });
      break;
    }
  });

  return (
    <>
      <hemisphereLight intensity={0.35} />
      <spotLight
        position={[30, 0, 50]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
      />
      <pointLight position={[-30, 0, 50]} intensity={0.5} />
      <Physics gravity={[0, 0, -30]}>
        <Plane color={niceColors[17][4]} position={[0, 0, -2]} />
        <Dice
          position={timestamp.transforms[0].position}
          quaternion={timestamp.transforms[0].quaternion}
        />
        <Dice
          position={timestamp.transforms[1].position}
          quaternion={timestamp.transforms[1].quaternion}
        />
        <Dice
          position={timestamp.transforms[2].position}
          quaternion={timestamp.transforms[2].quaternion}
        />
        <Dice
          position={timestamp.transforms[3].position}
          quaternion={timestamp.transforms[3].quaternion}
        />
        <Dice
          position={timestamp.transforms[4].position}
          quaternion={timestamp.transforms[4].quaternion}
        />
        <Board rotation={[Math.PI / 2, 0, 0]} scale={1.5} />
      </Physics>
    </>
  );
};

export default Scene;
