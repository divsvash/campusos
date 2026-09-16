import React from 'react';
import {
  CAMPUS_ZONES_3D,
  PEDESTRIAN_PATHS_3D,
  CAMPUS_TREES_3D,
} from '../../data/campus3dData';

interface GroundMaquette3DProps {
  isBuildingViewActive: boolean;
}

export const GroundMaquette3D: React.FC<GroundMaquette3DProps> = ({
  isBuildingViewActive,
}) => {
  // Ground plane: 140 width x 110 depth
  const groundColor = isBuildingViewActive ? '#EFECE3' : '#F2F0E9';

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Architectural Warm Ivory Ground Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[140, 110]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Ground Outer Border Trim (Drafting paper sheet edge) */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[140.2, 0.08, 110.2]} />
        <meshBasicMaterial color="#DDD8CD" />
      </mesh>

      {/* 2. Landscaped Lawns (Desaturated Sage Green) - elevated at y=0.06 */}
      {CAMPUS_ZONES_3D.map((zone) => {
        const isLawn = zone.type === 'lawn';
        const lawnColor = isLawn ? '#CFDCCD' : '#E8E5DC';

        return (
          <group key={zone.id} position={zone.center}>
            {/* Lawn slab */}
            <mesh position={[0, 0.06, 0]} receiveShadow>
              <boxGeometry args={[zone.size[0], 0.12, zone.size[1]]} />
              <meshStandardMaterial
                color={lawnColor}
                roughness={0.95}
                metalness={0.0}
              />
            </mesh>
            {/* Fine perimeter border line */}
            <mesh position={[0, 0.125, 0]}>
              <boxGeometry args={[zone.size[0] + 0.08, 0.02, zone.size[1] + 0.08]} />
              <meshBasicMaterial color="#C5C0B3" />
            </mesh>
          </group>
        );
      })}

      {/* 3. Roads & Pedestrian Paths - elevated cleanly at y=0.16 and y=0.20 */}
      {PEDESTRIAN_PATHS_3D.map((seg) => {
        return (
          <group key={seg.id}>
            {seg.points.map((pt, idx) => {
              if (idx === seg.points.length - 1) return null;
              const nextPt = seg.points[idx + 1];
              const midX = (pt[0] + nextPt[0]) / 2;
              const midZ = (pt[2] + nextPt[2]) / 2;
              const dx = nextPt[0] - pt[0];
              const dz = nextPt[2] - pt[2];
              const len = Math.sqrt(dx * dx + dz * dz);
              const angle = Math.atan2(dx, dz);

              const isBoulevard = seg.id === 'road-south-boulevard';
              const pathColor = isBoulevard ? '#DFDBD0' : '#E4E0D5';
              const pathY = isBoulevard ? 0.16 : 0.20;
              const pathH = isBoulevard ? 0.08 : 0.06;

              return (
                <group
                  key={`${seg.id}-${idx}`}
                  position={[midX, pathY, midZ]}
                  rotation={[0, angle, 0]}
                >
                  {/* Path Ribbon Mesh */}
                  <mesh receiveShadow position={[0, 0, 0]}>
                    <boxGeometry args={[seg.width, pathH, len]} />
                    <meshStandardMaterial
                      color={pathColor}
                      roughness={0.88}
                    />
                  </mesh>

                  {/* Centerline on South Boulevard */}
                  {isBoulevard && (
                    <mesh position={[0, 0.05, 0]}>
                      <boxGeometry args={[0.22, 0.02, len]} />
                      <meshBasicMaterial color="#FAF9F5" />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        );
      })}

      {/* 4. Sparse Minimal Architectural Trees */}
      {!isBuildingViewActive &&
        CAMPUS_TREES_3D.map((tree, idx) => {
          const trunkHeight = tree.height * 0.35;
          const coneHeight = tree.height * 0.65;

          return (
            <group key={idx} position={[tree.position[0], 0.14, tree.position[2]]}>
              {/* Minimal Cylinder Trunk */}
              <mesh position={[0, trunkHeight * 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, trunkHeight, 6]} />
                <meshStandardMaterial color="#8C8275" roughness={0.9} />
              </mesh>
              {/* Abstract Sage Model Cone Canopy */}
              <mesh position={[0, trunkHeight + coneHeight * 0.5, 0]} castShadow>
                <coneGeometry args={[tree.radius, coneHeight, 7]} />
                <meshStandardMaterial color="#8A9E88" roughness={0.92} />
              </mesh>
            </group>
          );
        })}
    </group>
  );
};
