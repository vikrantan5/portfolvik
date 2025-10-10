import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractiveSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        pointer.y * 0.5,
        0.05
      );
      mesh.current.rotation.z = THREE.MathUtils.lerp(
        mesh.current.rotation.z,
        pointer.x * 0.5,
        0.05
      );
    }
  });

  return (
    <mesh
      ref={mesh}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={hovered ? '#22d3ee' : '#3b82f6'}
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}
