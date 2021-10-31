import { forwardRef } from 'react';
import { BufferGeometry, Material, Mesh } from 'three';
import { GLTFLoader, GLTF } from 'three-stdlib/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

interface DiceGLTF extends GLTF {
  materials: {
    Dice_material_0: Material;
  };
  nodes: {
    '0_Dice_mesh_': { geometry: BufferGeometry };
  };
}

const Dice = forwardRef<Mesh, JSX.IntrinsicElements['mesh']>(
  ({ ...props }, ref) => {
    const { nodes, materials } = useLoader(
      GLTFLoader,
      '/meshes/dice.glb'
    ) as DiceGLTF;
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
  }
);

Dice.displayName = 'Dice';

export default Dice;
