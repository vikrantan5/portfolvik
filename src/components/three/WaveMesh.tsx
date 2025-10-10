import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WaveMesh() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.getElapsedTime();
      const geometry = mesh.current.geometry as THREE.PlaneGeometry;
      const position = geometry.attributes.position;

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const wave = Math.sin(x + time) * 0.1 + Math.cos(y + time) * 0.1;
        position.setZ(i, wave);
      }
      position.needsUpdate = true;
      mesh.current.rotation.z = time * 0.1;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, -3]}>
      <planeGeometry args={[8, 8, 32, 32]} />
      <meshStandardMaterial
        color="#06b6d4"
        wireframe
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}
