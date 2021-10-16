import type { BufferGeometry, Material } from 'three';
import { GLTFLoader, GLTF } from 'three-stdlib/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { useTrimesh } from '@react-three/cannon';

interface CupGLTF extends GLTF {
  materials: {
    Cup: Material;
  };
  nodes: {
    Cup: { geometry: BufferGeometry };
  };
}

const Cup = () => {
  const { nodes, materials } = useLoader(GLTFLoader, 'cup.glb') as CupGLTF;
  const geometry = nodes.Cup.geometry;
  const vertices = geometry.attributes.position.array;
  const indices = geometry.index!.array;
  const [ref, api] = useTrimesh(() => ({
    mass: 1,
    args: [vertices, indices],
    position: [0, 0, 32],
  }));
  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      material={materials.Cup}
      geometry={nodes.Cup.geometry}
    />
  );
};

export default Cup;
