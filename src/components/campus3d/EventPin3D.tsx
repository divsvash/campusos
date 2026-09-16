import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CampusEventItem } from '../../types';

interface EventPin3DProps {
  event: CampusEventItem;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (event: CampusEventItem) => void;
  reducedMotion?: boolean;
}

export const EventPin3D: React.FC<EventPin3DProps> = ({
  event,
  position,
  isSelected,
  onSelect,
  reducedMotion = false,
}) => {
  const pinRef = useRef<THREE.Group>(null);
  const initialY = position[1];

  useFrame(({ clock }) => {
    if (!pinRef.current) return;
    if (reducedMotion) {
      pinRef.current.position.y = initialY;
      return;
    }
    // Gentle bobbing animation (approx 0.2 units / a few pixels)
    const t = clock.getElapsedTime() * 2.5 + event.markerNumber;
    pinRef.current.position.y = initialY + Math.sin(t) * 0.18;
  });

  return (
    <group
      ref={pinRef}
      position={[position[0], initialY, position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(event);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
      }}
    >
      {/* Vertical Pin Stem connecting to building roof or ground */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshBasicMaterial color="#121212" />
      </mesh>

      {/* Ground Contact Dot */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 12]} />
        <meshBasicMaterial color="#F04B23" />
      </mesh>

      {/* Floating 3D Safety Orange Pin Head */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.35]} />
        <meshStandardMaterial
          color="#F04B23"
          roughness={0.4}
          metalness={0.1}
          emissive="#F04B23"
          emissiveIntensity={isSelected ? 0.35 : 0.1}
        />
      </mesh>

      {/* Outer Charcoal Border */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.28, 1.28, 0.3]} />
        <meshBasicMaterial color="#121212" />
      </mesh>

      {/* HTML Overlay with Number & Title */}
      <Html position={[0, 0.1, 0.2]} center className="select-none pointer-events-none">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <div
            className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-black text-[#FFFFFF] bg-[#F04B23] border border-[#121212] shadow-sm ${
              isSelected ? 'ring-2 ring-[#FFFFFF]' : ''
            }`}
          >
            {event.markerNumber}
          </div>
          <div className="hidden sm:flex px-1.5 py-0.5 bg-[#121212] text-[#FFFFFF] text-[9px] font-mono font-bold tracking-tight uppercase border border-[#F04B23]">
            [{event.markerNumber}] {event.title}
          </div>
        </div>
      </Html>
    </group>
  );
};
