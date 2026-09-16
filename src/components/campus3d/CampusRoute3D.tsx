import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { SUGGESTED_ROUTE_3D } from '../../data/campus3dData';

interface CampusRoute3DProps {
  isVisible: boolean;
  reducedMotion?: boolean;
}

export const CampusRoute3D: React.FC<CampusRoute3DProps> = ({
  isVisible,
  reducedMotion = false,
}) => {
  const pulseSphereRef = useRef<THREE.Mesh>(null);

  // Compute total length and curve for smooth interpolation
  const { curve } = useMemo(() => {
    const points = SUGGESTED_ROUTE_3D.map((p) => new THREE.Vector3(p[0], 0.28, p[2]));
    const catmull = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
    return { curve: catmull };
  }, []);

  // Animate the subtle moving directional pulse along the route
  useFrame(({ clock }) => {
    if (!pulseSphereRef.current || !isVisible || reducedMotion) return;
    const t = (clock.getElapsedTime() * 0.22) % 1;
    const pt = curve.getPointAt(t);
    pulseSphereRef.current.position.set(pt.x, 0.38, pt.z);
  });

  if (!isVisible) return null;

  return (
    <group>
      {/* 1. Route Path Segments (Elevated flat ribbon sitting cleanly above ground) */}
      {SUGGESTED_ROUTE_3D.map((pt, idx) => {
        if (idx === SUGGESTED_ROUTE_3D.length - 1) return null;
        const nextPt = SUGGESTED_ROUTE_3D[idx + 1];
        const midX = (pt[0] + nextPt[0]) / 2;
        const midZ = (pt[2] + nextPt[2]) / 2;
        const dx = nextPt[0] - pt[0];
        const dz = nextPt[2] - pt[2];
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);

        return (
          <group
            key={`route-${idx}`}
            position={[midX, 0.28, midZ]}
            rotation={[0, angle, 0]}
          >
            {/* Primary Green Ribbon */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.55, 0.05, len]} />
              <meshBasicMaterial color="#257A55" />
            </mesh>
            {/* Center Line Accent */}
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[0.12, 0.01, len * 0.85]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        );
      })}

      {/* 2. Route Waypoint Nodes at corners */}
      {SUGGESTED_ROUTE_3D.map((pt, idx) => (
        <mesh key={`node-${idx}`} position={[pt[0], 0.31, pt[2]]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
          <meshBasicMaterial color="#257A55" />
        </mesh>
      ))}

      {/* 3. Moving Directional Pulse Indicator */}
      {!reducedMotion && (
        <mesh ref={pulseSphereRef} position={[SUGGESTED_ROUTE_3D[0][0], 0.38, SUGGESTED_ROUTE_3D[0][2]]}>
          <boxGeometry args={[0.35, 0.1, 0.6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      )}

      {/* 4. Route Destination Marker at Academic Block entrance */}
      <group position={[SUGGESTED_ROUTE_3D[SUGGESTED_ROUTE_3D.length - 1][0], 0.32, SUGGESTED_ROUTE_3D[SUGGESTED_ROUTE_3D.length - 1][2]]}>
        <mesh>
          <cylinderGeometry args={[0.6, 0.6, 0.08, 20]} />
          <meshBasicMaterial color="#153E90" />
        </mesh>
        <Html position={[0, 1.2, 0]} center className="select-none pointer-events-none">
          <div className="px-2 py-0.5 bg-[#257A55] text-[#FFFFFF] font-mono text-[9px] font-bold tracking-wider uppercase border border-[#121212] shadow-sm flex items-center gap-1">
            <span>ENTRANCE REACHED · 4 MIN</span>
          </div>
        </Html>
      </group>
    </group>
  );
};
