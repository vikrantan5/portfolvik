import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GeometricShapes() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <tetrahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#60a5fa" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
