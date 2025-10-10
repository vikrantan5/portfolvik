import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField() {
  const points = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = [];
    const colors = [];
    const color1 = new THREE.Color('#3b82f6');
    const color2 = new THREE.Color('#06b6d4');

    for (let i = 0; i < 200; i++) {
      positions.push((Math.random() - 0.5) * 12);
      positions.push((Math.random() - 0.5) * 12);
      positions.push((Math.random() - 0.5) * 12);

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }

    return [new Float32Array(positions), new Float32Array(colors)];
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      points.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
