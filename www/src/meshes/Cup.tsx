import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import type { BufferGeometry, Material, Object3D } from 'three';
import { GLTFLoader, GLTF } from 'three-stdlib/loaders/GLTFLoader';

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
  return (
    <mesh
      castShadow
      receiveShadow
      material={materials.Cup}
      geometry={nodes.Cup.geometry}
      position={[6, 6, 6]}
    />
  );
};

export default Cup;
