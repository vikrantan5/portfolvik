import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GlowingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.getElapsedTime() + i * 2) * 0.5;
        child.position.x = Math.cos(state.clock.getElapsedTime() * 0.5 + i * 2) * 2;
      });
    }
  });

  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 2 - 2, 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={i === 0 ? '#3b82f6' : i === 1 ? '#06b6d4' : '#60a5fa'}
            emissive={i === 0 ? '#3b82f6' : i === 1 ? '#06b6d4' : '#60a5fa'}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}
