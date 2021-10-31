import { useEffect, useRef } from 'react';
import { Quaternion, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import niceColors from 'nice-color-palettes';
import { DiceValue, Dice as DiceType } from 'shared';

import Board from '~meshes/Board';
import Dice from '~meshes/Dice';
import Plane from '~meshes/Plane';

import dice1 from '~data/dice_1.json';
import dice2 from '~data/dice_2.json';
import dice3 from '~data/dice_3.json';
import dice4 from '~data/dice_4.json';
import dice5 from '~data/dice_5.json';

const dice = [dice1, dice2, dice3, dice4, dice5];

const eyeToIndex = (eye: DiceValue) => {
  if (eye === 1) {
    return 1;
  }
  if (eye === 2) {
    return 0;
  }
  if (eye === 5) {
    return 5;
  }
  if (eye === 6) {
    return 4;
  }
  return eye - 1;
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

const Scene = ({
  rollIndex,
  boardDice,
  savedDice,
}: {
  rollIndex: number;
  boardDice: DiceType[];
  savedDice: DiceType[];
}) => {
  const timestamp = useRef({ elapsed: 99, index: 0 });

  const ref1 = useRef<Mesh>(null);
  const ref2 = useRef<Mesh>(null);
  const ref3 = useRef<Mesh>(null);
  const ref4 = useRef<Mesh>(null);
  const ref5 = useRef<Mesh>(null);

  useEffect(() => {
    timestamp.current = { elapsed: 0, index: 0 };
  }, [rollIndex]);

  useFrame((s, delta) => {
    if (window.innerWidth > 960) {
      s.camera.position.set(-10 - (window.innerWidth - 240) / 96, 0, 96);
    } else {
      s.camera.position.set(0, 0, 64 + (1280 - window.innerWidth) / 16);
    }

    const elapsed = timestamp.current.elapsed + delta;
    timestamp.current.elapsed = elapsed;
    const num = boardDice.length;
    for (
      let i = timestamp.current.index;
      i < dice[num - 1].timestamps.length;
      i++
    ) {
      if (elapsed > dice[num - 1].timestamps[i].time) {
        continue;
      }
      timestamp.current.index = i;
      const refs = [ref1, ref2, ref3, ref4, ref5];
      boardDice.forEach((d, idx) => {
        const ref = refs[d.id - 1].current;
        if (ref) {
          ref.visible = true;
          const tf = dice[num - 1].timestamps[i].tf[idx];
          ref.position.set(tf.x, tf.y, tf.z);
          ref.quaternion.copy(
            offsetToQuaternion(
              dice[num - 1].offsets[idx][eyeToIndex(d.value)]
            ).multiply(new Quaternion(tf.qx, tf.qy, tf.qz, tf.qw))
          );
        }
      });
      savedDice.forEach((d) => {
        const ref = refs[d.id - 1].current;
        if (ref) {
          ref.visible = false;
        }
      });
      break;
    }
  });

  return (
    <>
      <hemisphereLight intensity={0.35} />
      <spotLight
        position={[30, 0, 40]}
        angle={0.6}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
      />
      <ambientLight intensity={0.7} />
      <Physics gravity={[0, 0, -30]}>
        <Plane color={niceColors[17][4]} position={[0, 0, -2]} />

        <Dice ref={ref1} />
        <Dice ref={ref2} />
        <Dice ref={ref3} />
        <Dice ref={ref4} />
        <Dice ref={ref5} />

        <Board rotation={[Math.PI / 2, 0, 0]} scale={1.5} />
      </Physics>
    </>
  );
};

export default Scene;
