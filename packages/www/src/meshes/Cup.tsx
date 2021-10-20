import type { BufferGeometry, Material } from 'three';
import { GLTFLoader, GLTF } from 'three-stdlib/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { useTrimesh } from '@react-three/cannon';

interface CupGLTF extends GLTF {
  materials: {
    material_0: Material;
  };
  nodes: {
    mesh_0: { geometry: BufferGeometry };
  };
}

const Cup = () => {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    'meshes/Dice.glb'
  ) as CupGLTF;
  console.log(nodes);
  console.log(materials);
  const geometry = nodes.mesh_0.geometry;
  const vertices = geometry.attributes.position.array;
  const indices = geometry.index!.array;
  /*const [ref, api] = useTrimesh(() => ({
    mass: 1,
    args: [vertices, indices],
    position: [0, 0, 32],
  }));*/
  return (
    <mesh
      castShadow
      receiveShadow
      material={materials.material_0}
      geometry={nodes.mesh_0.geometry}
      position={[0, 0, 32]}
      scale={[1, 1, 1]}
    />
  );
};

export default Cup;
