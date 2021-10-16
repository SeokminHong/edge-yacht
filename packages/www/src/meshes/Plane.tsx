import { MeshPhongMaterialProps } from '@react-three/fiber';
import { usePlane, PlaneProps as ThreePlaneProps } from '@react-three/cannon';

type PlaneProps = Pick<MeshPhongMaterialProps, 'color'> &
  Pick<ThreePlaneProps, 'position' | 'rotation'> & { size?: [number, number] };

function Plane({ color, size = [1000, 1000], ...props }: PlaneProps) {
  const [ref] = usePlane(() => ({ ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={size} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
}

export default Plane;
