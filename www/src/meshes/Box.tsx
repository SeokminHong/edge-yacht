import { useState } from 'react';
import { Triplet, useBox } from '@react-three/cannon';

type BoxProps = JSX.IntrinsicElements['mesh'] & {
  size?: Triplet;
};

const Box = ({ size = [4, 4, 4], ...props }: BoxProps) => {
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: size,
    position: props.position as Triplet,
  }));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

export default Box;
