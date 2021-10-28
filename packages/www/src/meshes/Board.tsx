import type { BufferGeometry, Material } from 'three';
import { GLTFLoader, GLTF } from 'three-stdlib/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

interface BoardGLTF extends GLTF {
  materials: {
    Board_material_0: Material;
  };
  nodes: {
    '0_Board_mesh_': { geometry: BufferGeometry };
  };
}

const Board = ({ ...props }: JSX.IntrinsicElements['mesh']) => {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/meshes/board.glb'
  ) as BoardGLTF;
  // const [ref, api] = useBox(() => ({
  //   mass: 1,
  //   args: [4, 4, 4],
  //   position: position as Triplet,
  //   rotation: rotation as Triplet,
  // }));
  return (
    <mesh
      {...props}
      // ref={ref}
      castShadow
      receiveShadow
      material={materials.Board_material_0}
      geometry={nodes['0_Board_mesh_'].geometry}
    ></mesh>
  );
};

export default Board;
