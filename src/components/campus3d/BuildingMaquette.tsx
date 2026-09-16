import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CampusLandmark3D } from '../../data/campus3dData';

interface BuildingMaquetteProps {
  landmark: CampusLandmark3D;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isBuildingViewActive: boolean;
  onSelect: (landmark: CampusLandmark3D) => void;
  onHover: (id: string | null) => void;
}

export const BuildingMaquette: React.FC<BuildingMaquetteProps> = ({
  landmark,
  isSelected,
  isHovered,
  isDimmed,
  isBuildingViewActive,
  onSelect,
  onHover,
}) => {
  // Visual group for smooth hover lift animation
  const visualGroupRef = useRef<THREE.Group>(null);
  const currentY = useRef(0);

  const [w, h, d] = landmark.dim3d;
  const geomType = landmark.geometryType;

  // Smooth hover lift animation on the VISUAL group only
  // The static collider remains at y=0 to prevent raycaster oscillation/jitter
  useFrame((_, delta) => {
    if (!visualGroupRef.current) return;
    const targetLift = isHovered && !isBuildingViewActive ? 0.35 : 0;
    currentY.current = THREE.MathUtils.damp(currentY.current, targetLift, 14, delta);
    visualGroupRef.current.position.y = currentY.current;
  });

  // Base materials for architectural maquette
  const { bodyColor, plinthColor, accentColor, edgeColor, opacity, transparent } =
    useMemo(() => {
      let body = '#FAF8F3';
      let plinth = '#EFECE3';
      let accent = '#E2DFD6';
      let edge = '#2C2B29';

      if (isSelected) {
        body = '#E8EEF8';
        plinth = '#D4E2F5';
        accent = '#153E90';
        edge = '#153E90';
      } else if (isHovered) {
        body = '#FFFFFF';
        plinth = '#EAE7DE';
        accent = '#696861';
        edge = '#121212';
      }

      const op = isBuildingViewActive ? 0.22 : isDimmed ? 0.35 : 1.0;
      const trans = isBuildingViewActive || isDimmed;

      return {
        bodyColor: body,
        plinthColor: plinth,
        accentColor: accent,
        edgeColor: edge,
        opacity: op,
        transparent: trans,
      };
    }, [isSelected, isHovered, isDimmed, isBuildingViewActive]);

  // Procedural architectural massing
  const renderBuildingForm = () => {
    switch (geomType) {
      // 1. Admin Block: Neoclassical 3-level pavilion with raised plinth, entrance portico, pediment
      case 'admin-block':
        return (
          <group>
            {/* Raised stone plinth */}
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[w + 1.2, 0.8, d + 1.2]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.9}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Main Central Volume */}
            <mesh position={[0, h * 0.5 + 0.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.9, h, d * 0.85]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Entrance Portico Columns & Pediment */}
            <mesh position={[0, h * 0.45 + 0.8, d * 0.45 + 0.6]} castShadow>
              <boxGeometry args={[w * 0.45, h * 0.9, 1.4]} />
              <meshStandardMaterial
                color={accentColor}
                roughness={0.8}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            <mesh position={[0, h + 1.1, d * 0.45 + 0.6]} castShadow>
              <coneGeometry args={[w * 0.28, 0.8, 4]} />
              <meshStandardMaterial
                color={edgeColor}
                roughness={0.7}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 2. Central Library: 3-level stepped clerestory lantern skylight & colonnade
      case 'library':
        return (
          <group>
            {/* Base lower reading halls */}
            <mesh position={[0, h * 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, h * 0.7, d]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Stepped central lantern / clerestory level */}
            <mesh position={[0, h * 0.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.6, h * 0.45, d * 0.6]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* West Colonnade Portico */}
            <mesh position={[-w * 0.48, h * 0.35, 0]} castShadow>
              <boxGeometry args={[1.0, h * 0.7, d * 0.85]} />
              <meshStandardMaterial
                color={accentColor}
                roughness={0.8}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 3. Auditorium: Grand tiered amphitheatre hall with sloped roof and canopy
      case 'auditorium':
        return (
          <group>
            {/* Grand Sloped Main Hall Volume */}
            <mesh position={[0, h * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Sloped Acoustic Roof Mass */}
            <mesh position={[0, h + 0.4, -d * 0.1]} rotation={[0.08, 0, 0]} castShadow>
              <boxGeometry args={[w * 0.95, 0.7, d * 0.8]} />
              <meshStandardMaterial
                color={accentColor}
                roughness={0.75}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Grand Entrance Canopy */}
            <mesh position={[0, h * 0.35, d * 0.5 + 1.2]} castShadow>
              <boxGeometry args={[w * 0.6, 0.35, 2.4]} />
              <meshStandardMaterial
                color={edgeColor}
                roughness={0.8}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 4. Kalam Seminar Hall: Tiered executive amphitheatre
      case 'seminar-hall':
        return (
          <group>
            <mesh position={[0, h * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Stepped Upper Tier */}
            <mesh position={[0, h + 0.3, -d * 0.15]} castShadow>
              <boxGeometry args={[w * 0.75, 0.6, d * 0.65]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Entrance Portico */}
            <mesh position={[0, h * 0.35, d * 0.5 + 0.8]} castShadow>
              <boxGeometry args={[w * 0.45, 0.3, 1.6]} />
              <meshStandardMaterial
                color={accentColor}
                roughness={0.8}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 5. Cafeteria: 2-level dining pavilion with outdoor dining pergola terrace
      case 'cafeteria':
        return (
          <group>
            {/* Main 2-Level Dining Hall */}
            <mesh position={[-w * 0.15, h * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.7, h, d]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Lower Terrace Cafe Pavilion */}
            <mesh position={[w * 0.32, h * 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.35, h * 0.6, d * 0.8]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Outdoor dining pergola roof frame */}
            <mesh position={[w * 0.32, h * 0.65, 0]} castShadow>
              <boxGeometry args={[w * 0.38, 0.15, d * 0.85]} />
              <meshStandardMaterial
                color={edgeColor}
                roughness={0.75}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 6. Sports Complex: Multi-sport arena with clearspan roof slab
      case 'sports-complex':
        return (
          <group>
            {/* Main Arena Volume */}
            <mesh position={[0, h * 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, h * 0.9, d]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Arena Curved / Chamfered Roof Slab */}
            <mesh position={[0, h * 0.95, 0]} castShadow>
              <boxGeometry args={[w * 0.92, 0.4, d * 0.92]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 7. Boys' & Girls' Hostels: 5-level modular quad with interior courtyard
      case 'hostel':
        return (
          <group>
            {/* North Wing */}
            <mesh position={[0, h * 0.5, -d * 0.38]} castShadow receiveShadow>
              <boxGeometry args={[w, h, d * 0.28]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* South Wing */}
            <mesh position={[0, h * 0.5, d * 0.38]} castShadow receiveShadow>
              <boxGeometry args={[w, h, d * 0.28]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* West Wing */}
            <mesh position={[-w * 0.38, h * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.25, h, d * 0.5]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Courtyard Floor Paving */}
            <mesh position={[0, 0.12, 0]} receiveShadow>
              <boxGeometry args={[w * 0.45, 0.15, d * 0.45]} />
              <meshStandardMaterial
                color={accentColor}
                roughness={0.9}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 8. Student Activity Centre: 2-level modern block with cantilevered studio volume
      case 'sac':
        return (
          <group>
            {/* Ground Level Workshop Base */}
            <mesh position={[-w * 0.1, h * 0.28, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.75, h * 0.55, d * 0.85]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Upper Cantilevered Creative Studio Volume */}
            <mesh position={[w * 0.15, h * 0.72, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.75, h * 0.55, d]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Cantilever Supporting Post */}
            <mesh position={[w * 0.45, h * 0.25, d * 0.4]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, h * 0.5, 8]} />
              <meshStandardMaterial
                color={edgeColor}
                roughness={0.7}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 9. Medical Centre: 1-level emergency clinic with canopy and red cross indicator
      case 'medical':
        return (
          <group>
            {/* Clinic Main Body */}
            <mesh position={[0, h * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Ambulance Drive-under Canopy */}
            <mesh position={[0, h * 0.7, d * 0.5 + 0.8]} castShadow>
              <boxGeometry args={[w * 0.7, 0.25, 1.8]} />
              <meshStandardMaterial
                color={accentColor}
                roughness={0.8}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Medical Emblem Accent Block */}
            <mesh position={[0, h + 0.25, 0]} castShadow>
              <boxGeometry args={[1.2, 0.4, 0.3]} />
              <meshBasicMaterial color="#F04B23" />
            </mesh>
          </group>
        );

      // 10. Main Entrance & Gate Plaza: Gate structure with twin pylons and barrier canopy
      case 'gate':
        return (
          <group>
            {/* Left Pylon */}
            <mesh position={[-w * 0.4, h * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, h, 2.2]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Right Pylon */}
            <mesh position={[w * 0.4, h * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, h, 2.2]} />
              <meshStandardMaterial
                color={bodyColor}
                roughness={0.82}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Overhead Architectural Portal Canopy */}
            <mesh position={[0, h * 0.95, 0]} castShadow>
              <boxGeometry args={[w + 1.2, 0.6, 2.6]} />
              <meshStandardMaterial
                color={edgeColor}
                roughness={0.7}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Security Checkpoint Booth */}
            <mesh position={[0, h * 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.4, h * 0.6, 1.8]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      // 11. Outdoor Ground: Recessed field with turf pitch and track border
      case 'sports-field':
        return (
          <group>
            {/* Ground Base Curb */}
            <mesh position={[0, 0.12, 0]} receiveShadow>
              <boxGeometry args={[w, 0.14, d]} />
              <meshStandardMaterial color="#C5D3C0" roughness={0.9} />
            </mesh>
            {/* Natural Grass Pitch */}
            <mesh position={[0, 0.22, 0]} receiveShadow>
              <boxGeometry args={[w * 0.75, 0.08, d * 0.65]} />
              <meshStandardMaterial color="#A8C4A0" roughness={0.95} />
            </mesh>
          </group>
        );

      // 12. Parking: Open parking zone with low 2-tier open structure
      case 'parking':
        return (
          <group>
            {/* Ground Parking Surface */}
            <mesh position={[0, 0.12, 0]} receiveShadow>
              <boxGeometry args={[w, 0.12, d]} />
              <meshStandardMaterial color="#DDD8CD" roughness={0.9} />
            </mesh>
            {/* Low 2-Tier Open-Deck Structure */}
            <mesh position={[-w * 0.2, h * 0.5 + 0.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.55, h, d * 0.85]} />
              <meshStandardMaterial
                color={plinthColor}
                roughness={0.85}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh position={[0, h * 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={bodyColor}
              roughness={0.82}
              transparent={transparent}
              opacity={opacity}
            />
          </mesh>
        );
    }
  };

  return (
    <group position={landmark.pos3d} rotation={[0, landmark.rotationY || 0, 0]}>
      {/* 
        CRITICAL ANTI-GLITCH COLLIDER:
        This static invisible hit box never moves on hover, ensuring the raycaster
        never oscillates between pointerover and pointerout (which causes 60fps jitter).
      */}
      <mesh
        visible={false}
        position={[0, h * 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(landmark);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(landmark.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[w + 1.2, h + 1.2, d + 1.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visual Building Geometry (Elevates smoothly on hover) */}
      <group ref={visualGroupRef}>{renderBuildingForm()}</group>
    </group>
  );
};
