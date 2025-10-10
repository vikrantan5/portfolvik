import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';

interface ThreeBackgroundProps {
  children: ReactNode;
  className?: string;
}

export default function ThreeBackground({ children, className = '' }: ThreeBackgroundProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {children}
      </Canvas>
    </div>
  );
}
