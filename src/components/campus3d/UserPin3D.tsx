import React from 'react';
import { Html } from '@react-three/drei';

interface UserPin3DProps {
  position: [number, number, number];
}

export const UserPin3D: React.FC<UserPin3DProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Ground Contact Disc */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 24]} />
        <meshBasicMaterial color="#153E90" />
      </mesh>

      {/* Outer Charcoal Ring */}
      <mesh position={[0, 0.045, 0]}>
        <ringGeometry args={[0.95, 1.15, 24]} />
        <meshBasicMaterial color="#121212" side={2} />
      </mesh>

      {/* Thin Vertical Locator Needle */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
        <meshBasicMaterial color="#153E90" />
      </mesh>

      {/* Top Small Needle Cap */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial color="#153E90" />
      </mesh>

      {/* Restrained 'YOU' Tag */}
      <Html position={[0, 2.7, 0]} center className="select-none pointer-events-none">
        <div className="px-2 py-0.5 bg-[#153E90] text-[#FFFFFF] font-mono text-[9px] font-bold tracking-widest uppercase border border-[#121212] shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-none bg-[#FFFFFF]" />
          <span>YOU ARE HERE</span>
        </div>
      </Html>
    </group>
  );
};
