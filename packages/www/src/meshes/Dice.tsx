import type { BufferGeometry, Material } from 'three';
import { GLTFLoader, GLTF } from 'three-stdlib/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { Triplet, useBox } from '@react-three/cannon';

interface DiceGLTF extends GLTF {
  materials: {
    Dice_material_0: Material;
  };
  nodes: {
    '0_Dice_mesh_': { geometry: BufferGeometry };
  };
}

const Dice = ({
  position,
  rotation,
  ...props
}: JSX.IntrinsicElements['mesh']) => {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/meshes/dice.glb'
  ) as DiceGLTF;
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [4, 4, 4],
    position: position as Triplet,
    rotation: rotation as Triplet,
  }));
  return (
    <mesh
      {...props}
      ref={ref}
      castShadow
      receiveShadow
      material={materials.Dice_material_0}
      geometry={nodes['0_Dice_mesh_'].geometry}
    ></mesh>
  );
};

export default Dice;
