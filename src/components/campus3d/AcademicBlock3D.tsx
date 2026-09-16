import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ACADEMIC_FLOOR_PLATES_3D, LEVEL_04_ROOMS_3D } from '../../data/campus3dData';
import { SpatialViewLevel } from '../../types';

interface AcademicBlock3DProps {
  spatialViewLevel: SpatialViewLevel;
  selectedFloorId: string;
  selectedRoomCode: string;
  isFloorIsolated: boolean;
  onSelectFloor: (floorId: string) => void;
  onSelectRoom: (roomCode: string, floorId: string) => void;
  onSelectBuilding: () => void;
  isBuildingHovered: boolean;
  onBuildingHover: (hovered: boolean) => void;
  isNextClassDestination?: boolean;
  isRoutingIndoor?: boolean;
  reducedMotion?: boolean;
}

export const AcademicBlock3D: React.FC<AcademicBlock3DProps> = ({
  spatialViewLevel,
  selectedFloorId,
  selectedRoomCode,
  isFloorIsolated,
  onSelectFloor,
  onSelectRoom,
  onSelectBuilding,
  isBuildingHovered,
  onBuildingHover,
  isNextClassDestination = true,
  isRoutingIndoor = true,
  reducedMotion = false,
}) => {
  const visualGroupRef = useRef<THREE.Group>(null);
  const [hoveredFloorId, setHoveredFloorId] = useState<string | null>(null);

  // Separation progress animation factor: 0 (compact campus) to 1 (fully exploded)
  const separationFactor = useRef(0);
  const isolationFactor = useRef(0);

  const isExploded = spatialViewLevel !== 'CAMPUS';
  const isSingleFloor = spatialViewLevel === 'FLOOR' || isFloorIsolated;

  useFrame((_, delta) => {
    const targetSeparation = isExploded ? 1 : 0;
    const targetIsolation = isSingleFloor ? 1 : 0;
    const speed = reducedMotion ? 50 : 7;

    separationFactor.current = THREE.MathUtils.damp(
      separationFactor.current,
      targetSeparation,
      speed,
      delta
    );

    isolationFactor.current = THREE.MathUtils.damp(
      isolationFactor.current,
      targetIsolation,
      speed,
      delta
    );
  });

  const baseWidth = 22;
  const baseDepth = 16;
  const plateThickness = 0.6;

  return (
    <group position={[4, 0, -10]}>
      {/* 
        CRITICAL ANTI-GLITCH STATIC HIT COLLIDER (Campus View):
        Provides stable hit area that never oscillates
      */}
      {spatialViewLevel === 'CAMPUS' && (
        <mesh
          visible={false}
          position={[0, 4.5, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectBuilding();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onBuildingHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onBuildingHover(false);
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[baseWidth + 2.0, 9.0, baseDepth + 2.0]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Visual Building Structure */}
      <group ref={visualGroupRef}>
        {/* Plinth Base at ground */}
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <boxGeometry args={[baseWidth + 1.2, 0.4, baseDepth + 1.2]} />
          <meshStandardMaterial color="#EAE7DE" roughness={0.9} />
        </mesh>

        {/* Main South Entrance Canopy (Campus view) */}
        {!isExploded && (
          <group position={[0, 0.9, baseDepth * 0.5 + 1.0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[7.0, 0.25, 2.2]} />
              <meshStandardMaterial color={isNextClassDestination ? '#153E90' : '#121212'} />
            </mesh>
            <mesh position={[-3.1, -0.45, 0.9]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.9, 8]} />
              <meshStandardMaterial color="#121212" />
            </mesh>
            <mesh position={[3.1, -0.45, 0.9]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.9, 8]} />
              <meshStandardMaterial color="#121212" />
            </mesh>
          </group>
        )}

        {/* Vertical Lift Core Guide Shafts (Visible when exploded) */}
        {isExploded && (
          <group position={[0, 10, 0]}>
            {/* Central Lift Guide Post */}
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 24, 8]} />
              <meshBasicMaterial color="#153E90" opacity={0.4} transparent />
            </mesh>
            {/* Corner structural ghost alignment lines */}
            {[-baseWidth * 0.48, baseWidth * 0.48].map((x) =>
              [-baseDepth * 0.48, baseDepth * 0.48].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, 0, z]}>
                  <cylinderGeometry args={[0.04, 0.04, 24, 6]} />
                  <meshBasicMaterial color="#C9C6BC" opacity={0.3} transparent />
                </mesh>
              ))
            )}
          </group>
        )}

        {/* 6 Stacked Architectural Floor Plates */}
        {ACADEMIC_FLOOR_PLATES_3D.map((fl) => {
          const isFloorSelected = selectedFloorId === fl.id;
          const isFloorHovered = hoveredFloorId === fl.id;

          // Vertical Y positioning:
          // In campus view: compact stack (1.35 spacing)
          // In exploded view: separated stack (3.8 spacing)
          // We do NOT offset Y on hover to prevent raycast jitter loop!
          const compactY = fl.elevationIndex * 1.35 + 0.4;
          const explodedY = fl.elevationIndex * 3.8 + 0.8;
          const currentFloorY =
            compactY * (1 - separationFactor.current) +
            explodedY * separationFactor.current;

          // Opacity when isolating a single floor
          const isIsolatedTarget = fl.id === selectedFloorId;
          const opacity = isSingleFloor
            ? isIsolatedTarget
              ? 1.0
              : 0.1
            : 1.0;

          const isDestinationPlate = fl.id === '04' && isNextClassDestination;

          return (
            <group
              key={fl.id}
              position={[0, currentFloorY, 0]}
              onClick={(e) => {
                if (isExploded) {
                  e.stopPropagation();
                  onSelectFloor(fl.id);
                }
              }}
              onPointerOver={(e) => {
                if (isExploded) {
                  e.stopPropagation();
                  setHoveredFloorId(fl.id);
                  document.body.style.cursor = 'pointer';
                }
              }}
              onPointerOut={(e) => {
                if (isExploded) {
                  e.stopPropagation();
                  setHoveredFloorId(null);
                  document.body.style.cursor = 'default';
                }
              }}
            >
              {/* Floor Slab Geometry */}
              <mesh castShadow receiveShadow position={[0, plateThickness * 0.5, 0]}>
                <boxGeometry args={[baseWidth, plateThickness, baseDepth]} />
                <meshStandardMaterial
                  color={
                    isFloorSelected && isExploded
                      ? '#E8EEF8'
                      : isFloorHovered && isExploded
                      ? '#FFFFFF'
                      : isDestinationPlate && !isExploded
                      ? '#F2F6FC'
                      : '#FAF8F3'
                  }
                  roughness={0.82}
                  transparent={isSingleFloor}
                  opacity={opacity}
                />
              </mesh>

              {/* Perimeter Edge Trim */}
              <mesh position={[0, plateThickness * 0.5, 0]}>
                <boxGeometry args={[baseWidth + 0.12, plateThickness + 0.08, baseDepth + 0.12]} />
                <meshBasicMaterial
                  color={
                    isFloorSelected && isExploded
                      ? '#153E90'
                      : isFloorHovered && isExploded
                      ? '#121212'
                      : '#C9C6BC'
                  }
                  wireframe
                  transparent={isSingleFloor}
                  opacity={opacity}
                />
              </mesh>

              {/* Central Core (Lift & Stairs) on all floors */}
              <group position={[0, plateThickness, 0]}>
                {/* Central Lift Bank */}
                <mesh position={[0, 0.45, 0]} castShadow>
                  <boxGeometry args={[3.2, 0.9, 3.2]} />
                  <meshStandardMaterial
                    color="#153E90"
                    roughness={0.8}
                    transparent={isSingleFloor}
                    opacity={opacity}
                  />
                </mesh>

                {/* Stair Cores */}
                <mesh position={[-baseWidth * 0.38, 0.4, 0]} castShadow>
                  <boxGeometry args={[2.0, 0.8, 2.6]} />
                  <meshStandardMaterial
                    color="#696861"
                    roughness={0.85}
                    transparent={isSingleFloor}
                    opacity={opacity}
                  />
                </mesh>
                <mesh position={[baseWidth * 0.38, 0.4, 0]} castShadow>
                  <boxGeometry args={[2.0, 0.8, 2.6]} />
                  <meshStandardMaterial
                    color="#696861"
                    roughness={0.85}
                    transparent={isSingleFloor}
                    opacity={opacity}
                  />
                </mesh>

                {/* Corridor Spine */}
                <mesh position={[0, 0.02, 0]} receiveShadow>
                  <boxGeometry args={[baseWidth * 0.9, 0.04, 2.2]} />
                  <meshBasicMaterial
                    color="#EAE7DE"
                    transparent={isSingleFloor}
                    opacity={opacity}
                  />
                </mesh>
              </group>

              {/* Floor Level HTML Label (Visible in Exploded Building View) */}
              {isExploded && !isSingleFloor && (
                <Html
                  position={[-baseWidth * 0.5 - 2.0, plateThickness * 0.5, 0]}
                  center
                  className="pointer-events-none select-none"
                >
                  <div
                    className={`px-2.5 py-1 border transition-colors font-mono whitespace-nowrap ${
                      isFloorSelected
                        ? 'bg-[#153E90] text-[#FFFFFF] border-[#121212] font-bold shadow-md'
                        : isFloorHovered
                        ? 'bg-[#121212] text-[#FFFFFF] border-[#121212]'
                        : 'bg-[#FFFFFF] text-[#121212] border-[#C9C6BC]'
                    }`}
                  >
                    <div className="text-[11px] font-bold flex items-center gap-1.5">
                      <span>LEVEL {fl.floorNumber}</span>
                      {isDestinationPlate && (
                        <span className="w-1.5 h-1.5 bg-[#F04B23] inline-block" />
                      )}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-opacity-80">
                      {fl.functionLabel}
                    </div>
                  </div>
                </Html>
              )}

              {/* Detailed Room Layout for Level 04 */}
              {fl.id === '04' && (isSingleFloor || isFloorSelected) && (
                <group position={[0, plateThickness + 0.02, 0]}>
                  {/* Room Partitions */}
                  {LEVEL_04_ROOMS_3D.map((room) => {
                    const isSelectedRoom = selectedRoomCode === room.code;
                    const isDestination = room.isDestination || room.code === 'LH 406';
                    const isEventRoom = room.hasEvent || room.code === 'SEM 404';

                    let fillColor = '#FAF8F3';
                    let strokeColor = '#C9C6BC';

                    if (isDestination) {
                      fillColor = '#153E90'; // SRM Blue
                      strokeColor = '#121212';
                    } else if (isEventRoom) {
                      fillColor = '#F04B23'; // Safety Orange
                      strokeColor = '#121212';
                    } else if (isSelectedRoom) {
                      fillColor = '#D4E2F5';
                      strokeColor = '#153E90';
                    } else if (room.type === 'science') {
                      fillColor = '#EEF4EE'; // Subtle lab tint
                      strokeColor = '#C9C6BC';
                    }

                    return (
                      <group
                        key={room.code}
                        position={[room.localX, 0, room.localZ]}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRoom(room.code, fl.id);
                        }}
                      >
                        {/* Room Floor Surface */}
                        <mesh position={[0, 0.04, 0]} receiveShadow>
                          <boxGeometry args={[room.width * 0.94, 0.08, room.depth * 0.94]} />
                          <meshStandardMaterial
                            color={fillColor}
                            roughness={0.7}
                            transparent={isSingleFloor}
                            opacity={opacity}
                          />
                        </mesh>

                        {/* Room Perimeter Walls */}
                        <mesh position={[0, 0.35, 0]}>
                          <boxGeometry args={[room.width, 0.7, room.depth]} />
                          <meshBasicMaterial
                            color={strokeColor}
                            wireframe
                            transparent={isSingleFloor}
                            opacity={opacity}
                          />
                        </mesh>

                        {/* Room Code HTML Label */}
                        <Html
                          position={[0, 0.55, 0]}
                          center
                          className="pointer-events-none select-none"
                        >
                          <div
                            className={`px-1.5 py-0.5 border text-center font-mono whitespace-nowrap text-[9px] ${
                              isDestination
                                ? 'bg-[#153E90] text-[#FFFFFF] font-bold border-[#121212]'
                                : isEventRoom
                                ? 'bg-[#F04B23] text-[#FFFFFF] font-bold border-[#121212]'
                                : 'bg-[#FFFFFF]/90 text-[#121212] border-[#C9C6BC]'
                            }`}
                          >
                            <div>{room.code}</div>
                            {isDestination && (
                              <div className="text-[7px] text-[#FFFFFF] tracking-wider uppercase font-bold">
                                NEXT CLASS
                              </div>
                            )}
                          </div>
                        </Html>
                      </group>
                    );
                  })}

                  {/* Indoor Route from Lift Core to LH 406 */}
                  {isRoutingIndoor && (
                    <group position={[0, 0.12, 0]}>
                      {/* Segment 1: Lift Core along central corridor to East */}
                      <mesh position={[2.5, 0, 0]}>
                        <boxGeometry args={[5.2, 0.05, 0.45]} />
                        <meshBasicMaterial color="#257A55" />
                      </mesh>
                      {/* Segment 2: Turn South into LH 406 Doorway */}
                      <mesh position={[5.1, 0, 2.2]}>
                        <boxGeometry args={[0.45, 0.05, 4.4]} />
                        <meshBasicMaterial color="#257A55" />
                      </mesh>
                    </group>
                  )}
                </group>
              )}
            </group>
          );
        })}
      </group>

      {/* Floating NEXT CLASS Marker above Academic Block in Campus View */}
      {spatialViewLevel === 'CAMPUS' && isNextClassDestination && (
        <Html
          position={[0, 11.2, 0]}
          center
          className="pointer-events-none select-none"
        >
          <div className="flex flex-col items-center">
            <div className="bg-[#153E90] text-[#FFFFFF] px-2.5 py-1 border border-[#121212] shadow-md font-mono text-[10px] font-bold tracking-tight whitespace-nowrap flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#F04B23] animate-ping" />
              <span>NEXT CLASS · LH 406</span>
            </div>
            <div className="w-0.5 h-3 bg-[#153E90]" />
          </div>
        </Html>
      )}
    </group>
  );
};
