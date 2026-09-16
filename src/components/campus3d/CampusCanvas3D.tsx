import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  CAMPUS_LANDMARKS_3D,
  CampusLandmark3D,
} from '../../data/campus3dData';
import { CAMPUS_EVENTS_DATA } from '../../data/campusMasterData';
import {
  CampusCategory,
  CampusEventItem,
  CampusLandmark,
  SpatialViewLevel,
} from '../../types';
import { GroundMaquette3D } from './GroundMaquette3D';
import { BuildingMaquette } from './BuildingMaquette';
import { AcademicBlock3D } from './AcademicBlock3D';
import { EventPin3D } from './EventPin3D';
import { UserPin3D } from './UserPin3D';
import { CampusRoute3D } from './CampusRoute3D';
import { BuildingLabels3D } from './BuildingLabels3D';
import { CampusCameraController } from './CampusCameraController';

export interface CampusCanvas3DProps {
  spatialViewLevel: SpatialViewLevel;
  selectedLandmarkId: string | null;
  selectedEventId: string | null;
  selectedFloorId: string;
  selectedRoomCode: string;
  isFloorIsolated: boolean;
  isRoutingIndoor: boolean;
  activeCategory: CampusCategory;
  onSelectLandmark: (landmark: CampusLandmark) => void;
  onSelectEvent: (event: CampusEventItem) => void;
  onSelectFloor: (floorId: string) => void;
  onSelectRoom: (roomCode: string, floorId: string) => void;
  onEnterBuilding: () => void;
  onReturnToCampus: () => void;
}

export const CampusCanvas3D: React.FC<CampusCanvas3DProps> = ({
  spatialViewLevel,
  selectedLandmarkId,
  selectedEventId,
  selectedFloorId,
  selectedRoomCode,
  isFloorIsolated,
  isRoutingIndoor,
  activeCategory,
  onSelectLandmark,
  onSelectEvent,
  onSelectFloor,
  onSelectRoom,
  onEnterBuilding,
  onReturnToCampus,
}) => {
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Selected Landmark 3D object
  const selectedLandmark = useMemo(() => {
    if (!selectedLandmarkId) return null;
    return CAMPUS_LANDMARKS_3D.find((l) => l.id === selectedLandmarkId) || null;
  }, [selectedLandmarkId]);

  // Filter landmarks by activeCategory
  const filteredLandmarks = useMemo(() => {
    return CAMPUS_LANDMARKS_3D.filter((l) => {
      if (activeCategory === 'ALL') return true;
      return l.category === activeCategory;
    });
  }, [activeCategory]);

  // Positions for Event Pins in 3D:
  // Event 1: Cloud Community Meetup -> Academic Block Roof forecourt
  // Event 2: Cultural Society Auditions -> Auditorium Entrance
  // Event 3: Five-a-Side Tournament -> Outdoor Ground Pitch
  const eventPositions: Record<string, [number, number, number]> = {
    'ev-01': [4, 9.6, -8],
    'ev-02': [-21, 6.2, 10],
    'ev-03': [36, 1.2, 28],
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(180, z + 20));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(60, z - 20));
  const handleReset = () => {
    setZoomLevel(100);
    setResetTrigger(Date.now());
  };

  const isBuildingView = spatialViewLevel === 'BUILDING' || spatialViewLevel === 'FLOOR';

  return (
    <div className="relative w-full h-full bg-[#EDEAE1] overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        orthographic
        camera={{
          position: [70, 80, 70],
          zoom: 14.5,
          near: 10,
          far: 240,
        }}
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onPointerDown={(e) => {
          // If clicking empty canvas area in campus view, deselect building
          if (e.target === e.currentTarget && spatialViewLevel === 'CAMPUS') {
            // Keep selection clean
          }
        }}
      >
        {/* Studio Lighting Setup for Physical Maquette */}
        <ambientLight color="#FFFFFF" intensity={0.72} />
        {/* Main Sun Directional Light (Casting Soft Shadows) */}
        <directionalLight
          position={[60, 90, 45]}
          intensity={1.25}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-camera-near={10}
          shadow-camera-far={200}
          shadow-bias={-0.0005}
        />
        {/* Secondary Soft Ambient Fill Light */}
        <directionalLight position={[-40, 60, -40]} intensity={0.4} color="#F5F3EC" />

        {/* Orthographic Architectural Camera Controller */}
        <CampusCameraController
          spatialViewLevel={spatialViewLevel}
          selectedLandmarkPos={selectedLandmark?.pos3d || null}
          isFloorIsolated={isFloorIsolated}
          reducedMotion={reducedMotion}
          onResetTrigger={resetTrigger}
          zoomLevel={zoomLevel}
        />

        {/* 1. Ground Plane, Roads, Paths, Lawns, Trees */}
        <GroundMaquette3D isBuildingViewActive={isBuildingView} />

        {/* 2. Campus Landmark Buildings (Except Academic Block which has its custom 6-floor stack) */}
        <group>
          {CAMPUS_LANDMARKS_3D.map((landmark) => {
            if (landmark.id === 'AB-01') return null; // Handled separately

            const isSelected = selectedLandmarkId === landmark.id;
            const isHovered = hoveredLandmarkId === landmark.id;
            const isCategoryMatch =
              activeCategory === 'ALL' || landmark.category === activeCategory;
            const isDimmed = !isCategoryMatch || (!!selectedLandmarkId && !isSelected);

            return (
              <BuildingMaquette
                key={landmark.id}
                landmark={landmark}
                isSelected={isSelected}
                isHovered={isHovered}
                isDimmed={isDimmed}
                isBuildingViewActive={isBuildingView}
                onSelect={(lm) => onSelectLandmark(lm)}
                onHover={(id) => setHoveredLandmarkId(id)}
              />
            );
          })}
        </group>

        {/* 3. Academic Block (6-Floor Stack with Exploded Cutaway & Floor Isolation) */}
        <AcademicBlock3D
          spatialViewLevel={spatialViewLevel}
          selectedFloorId={selectedFloorId}
          selectedRoomCode={selectedRoomCode}
          isFloorIsolated={isFloorIsolated}
          onSelectFloor={onSelectFloor}
          onSelectRoom={onSelectRoom}
          onSelectBuilding={() => {
            const ab = CAMPUS_LANDMARKS_3D.find((l) => l.id === 'AB-01')!;
            onSelectLandmark(ab);
          }}
          isBuildingHovered={hoveredLandmarkId === 'AB-01'}
          onBuildingHover={(hovered) => setHoveredLandmarkId(hovered ? 'AB-01' : null)}
          isNextClassDestination={true}
          isRoutingIndoor={isRoutingIndoor}
          reducedMotion={reducedMotion}
        />

        {/* 4. Active Green Campus Navigation Route (Main Gate to Academic Block) */}
        <CampusRoute3D isVisible={!isBuildingView} reducedMotion={reducedMotion} />

        {/* 5. User Location Pin at Main Entrance */}
        {!isBuildingView && <UserPin3D position={[-40, 0.08, 26]} />}

        {/* 6. Safety Orange 3D Event Pins */}
        {!isBuildingView &&
          CAMPUS_EVENTS_DATA.map((evt) => {
            const pos = eventPositions[evt.id] || [0, 2, 0];
            const isSelected = selectedEventId === evt.id;

            return (
              <EventPin3D
                key={evt.id}
                event={evt}
                position={pos}
                isSelected={isSelected}
                onSelect={onSelectEvent}
                reducedMotion={reducedMotion}
              />
            );
          })}

        {/* 7. HTML Building Labels Overlay */}
        <BuildingLabels3D
          landmarks={filteredLandmarks}
          selectedId={selectedLandmarkId}
          hoveredId={hoveredLandmarkId}
          isBuildingViewActive={isBuildingView}
          onSelect={onSelectLandmark}
        />
      </Canvas>

      {/* Floating 3D Navigation Controls HUD (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 font-mono text-xs">
        <div className="bg-[#FFFFFF]/95 border border-[#121212] p-1 flex items-center shadow-sm">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 flex items-center justify-center hover:bg-[#F2F0E9] active:bg-[#121212] active:text-[#FFFFFF] transition-colors border-r border-[#E0DDD5]"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 flex items-center justify-center hover:bg-[#F2F0E9] active:bg-[#121212] active:text-[#FFFFFF] transition-colors border-r border-[#E0DDD5]"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-2 h-7 flex items-center gap-1 hover:bg-[#F2F0E9] active:bg-[#121212] active:text-[#FFFFFF] transition-colors"
            title="Reset Isometric View"
            aria-label="Reset Isometric View"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px] font-bold">RESET VIEW</span>
          </button>
        </div>

        {/* View mode indicator / Pan drag guide */}
        <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-[#FFFFFF]/90 border border-[#C9C6BC] text-[10px] text-[#4A4843]">
          <span className="font-bold text-[#121212]">DRAG:</span> PAN
          <span className="text-[#C9C6BC]">|</span>
          <span className="font-bold text-[#121212]">ALT+DRAG:</span> ROTATE ±25°
          <span className="text-[#C9C6BC]">|</span>
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`font-bold transition-colors ${
              reducedMotion ? 'text-[#F04B23]' : 'text-[#257A55]'
            }`}
          >
            MOTION: {reducedMotion ? 'REDUCED' : 'ON'}
          </button>
        </div>
      </div>

      {/* Return to Campus Button (Prominently visible when in Building or Floor view) */}
      {isBuildingView && (
        <div className="absolute top-4 left-4 z-20">
          <button
            type="button"
            onClick={onReturnToCampus}
            className="px-3 py-1.5 bg-[#FFFFFF] border-2 border-[#121212] font-mono text-xs font-bold text-[#121212] hover:bg-[#153E90] hover:text-[#FFFFFF] hover:border-[#153E90] transition-colors shadow-md flex items-center gap-2 uppercase tracking-wider"
          >
            <span>← RETURN TO CAMPUS</span>
          </button>
        </div>
      )}

      {/* Campus Status Legend (Bottom Right) */}
      {!isBuildingView && (
        <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-3 px-3 py-1.5 bg-[#FFFFFF]/95 border border-[#121212] shadow-sm font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#153E90] border border-[#121212]" />
            <span className="font-bold text-[#121212]">ACADEMIC BLOCK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#257A55]" />
            <span className="font-bold text-[#257A55]">ACTIVE ROUTE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#F04B23]" />
            <span className="font-bold text-[#F04B23]">LIVE EVENTS</span>
          </div>
        </div>
      )}
    </div>
  );
};
