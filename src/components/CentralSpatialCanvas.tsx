import React, { useState } from 'react';
import {
  Floor,
  Room,
  WayfindingEvent,
  BuildingMeta,
  SpatialViewLevel,
  CampusLandmark,
  CampusCategory,
  CampusEventItem,
} from '../types';
import { CampusCanvas3D } from './campus3d/CampusCanvas3D';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Box,
  FileText,
} from 'lucide-react';

interface CentralSpatialCanvasProps {
  spatialViewLevel: SpatialViewLevel;
  onNavigateHierarchy: (level: SpatialViewLevel, floor?: Floor, room?: Room) => void;
  // Campus Map props
  selectedLandmark: CampusLandmark | null;
  onSelectLandmark: (landmark: CampusLandmark) => void;
  selectedCategory: CampusCategory;
  onSelectCategory: (category: CampusCategory) => void;
  onEnterAcademicBlock: () => void;
  selectedEventId: string | null;
  onSelectCampusEvent: (event: CampusEventItem) => void;
  isRoutingCampus: boolean;
  // Building Cutaway props
  building: BuildingMeta;
  floors: Floor[];
  selectedFloor: Floor;
  selectedRoom: Room;
  onSelectFloor: (floor: Floor) => void;
  onSelectRoom: (room: Room, floor: Floor) => void;
  isFloorIsolated: boolean;
  onToggleIsolateFloor: () => void;
  isRoutingIndoor: boolean;
  nearbyEvent: WayfindingEvent;
  onSelectIndoorEvent: () => void;
  activeContextType: 'landmark' | 'room' | 'event';
}

export const CentralSpatialCanvas: React.FC<CentralSpatialCanvasProps> = ({
  spatialViewLevel,
  onNavigateHierarchy,
  selectedLandmark,
  onSelectLandmark,
  selectedCategory,
  onSelectCategory,
  onEnterAcademicBlock,
  selectedEventId,
  onSelectCampusEvent,
  isRoutingCampus,
  building,
  floors,
  selectedFloor,
  selectedRoom,
  onSelectFloor,
  onSelectRoom,
  isFloorIsolated,
  onToggleIsolateFloor,
  isRoutingIndoor,
  nearbyEvent,
  onSelectIndoorEvent,
  activeContextType,
}) => {
  // Mode toggle: Primary is tactile 3D Maquette, with 2D Schematic fallback
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');

  const categories: CampusCategory[] = [
    'ALL',
    'ACADEMIC',
    'EVENTS',
    'FOOD',
    'SPORTS',
    'SERVICES',
  ];

  // Map 3D floor id (e.g. '04') to Floor object
  const handleSelectFloor3D = (floorId: string) => {
    const matchedFloor = floors.find(
      (f) => f.number === floorId || f.id === floorId
    );
    if (matchedFloor) {
      onSelectFloor(matchedFloor);
      onNavigateHierarchy('FLOOR', matchedFloor);
    }
  };

  // Map 3D room code (e.g. 'LH 406') to Room & Floor objects
  const handleSelectRoom3D = (roomCode: string, floorId: string) => {
    const targetFloor =
      floors.find((f) => f.number === floorId || f.id === floorId) || selectedFloor;
    const targetRoom =
      targetFloor?.rooms.find((r) => r.code === roomCode) || selectedRoom;
    if (targetRoom && targetFloor) {
      onSelectRoom(targetRoom, targetFloor);
      onNavigateHierarchy('ROOM', targetFloor, targetRoom);
    }
  };

  return (
    <div
      id="spatial-canvas-container"
      className="relative flex-1 h-full bg-[#EDEAE1] flex flex-col select-none overflow-hidden"
    >
      {/* ================= 1. HIERARCHICAL CLICKABLE BREADCRUMB ================= */}
      <div
        id="wayfinding-breadcrumb"
        className="px-6 py-2.5 flex flex-wrap items-center justify-between border-b border-[#C9C6BC] text-xs font-mono uppercase tracking-wider text-[#696861] z-20 shrink-0 bg-[#F2F0E9]"
      >
        {/* Clickable Breadcrumb Trail */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* CAMPUS level */}
          <button
            type="button"
            onClick={() => onNavigateHierarchy('CAMPUS')}
            className={`hover:text-[#121212] transition-colors cursor-pointer ${
              spatialViewLevel === 'CAMPUS'
                ? 'text-[#121212] font-bold border-b-2 border-[#121212]'
                : 'text-[#696861]'
            }`}
          >
            CAMPUS
          </button>

          {/* BUILDING level */}
          {spatialViewLevel !== 'CAMPUS' && (
            <>
              <span className="text-[#C9C6BC]">/</span>
              <button
                type="button"
                onClick={() => onNavigateHierarchy('BUILDING')}
                className={`hover:text-[#153E90] transition-colors cursor-pointer ${
                  spatialViewLevel === 'BUILDING' && !isFloorIsolated
                    ? 'text-[#153E90] font-bold border-b-2 border-[#153E90]'
                    : 'text-[#696861]'
                }`}
              >
                {building.name}
              </button>
            </>
          )}

          {/* FLOOR level */}
          {spatialViewLevel !== 'CAMPUS' && selectedFloor && (
            <>
              <span className="text-[#C9C6BC]">/</span>
              <button
                type="button"
                onClick={() => onNavigateHierarchy('FLOOR', selectedFloor)}
                className={`hover:text-[#153E90] transition-colors cursor-pointer ${
                  spatialViewLevel === 'FLOOR' || isFloorIsolated
                    ? 'text-[#153E90] font-bold border-b-2 border-[#153E90]'
                    : 'text-[#696861]'
                }`}
              >
                LEVEL {selectedFloor.number}
              </button>
            </>
          )}

          {/* ROOM level */}
          {spatialViewLevel !== 'CAMPUS' && selectedRoom && (
            <>
              <span className="text-[#C9C6BC]">/</span>
              <span className="text-[#121212] font-bold bg-[#E8EEF8] px-1.5 py-0.5 border border-[#153E90] text-[#153E90]">
                {activeContextType === 'event'
                  ? nearbyEvent.roomCode
                  : selectedRoom.code}
              </span>
            </>
          )}

          {/* Landmark selected on campus */}
          {spatialViewLevel === 'CAMPUS' &&
            selectedLandmark &&
            selectedLandmark.id !== 'AB-01' && (
              <>
                <span className="text-[#C9C6BC]">/</span>
                <span className="text-[#153E90] font-bold bg-[#E8EEF8] px-1.5 py-0.5 border border-[#153E90]">
                  {selectedLandmark.shortLabel}
                </span>
              </>
            )}
        </div>

        {/* View State Controls */}
        <div className="flex items-center gap-3 text-[11px]">
          {spatialViewLevel === 'CAMPUS' ? (
            <div className="flex items-center gap-2">
              <span className="text-[#696861] hidden sm:inline">
                3D ARCHITECTURAL MAQUETTE
              </span>
              <button
                type="button"
                onClick={onEnterAcademicBlock}
                className="px-2.5 py-1 bg-[#153E90] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-wider hover:bg-[#122e6b] transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>ENTER BUILDING →</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateHierarchy('CAMPUS')}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] text-[#FFFFFF] hover:bg-[#153E90] transition-colors cursor-pointer text-[10px] font-bold"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>RETURN TO CAMPUS</span>
              </button>

              <button
                type="button"
                onClick={onToggleIsolateFloor}
                className="px-2 py-1 border border-[#C9C6BC] text-[#121212] hover:bg-[#E8E5DC] text-[10px] transition-colors cursor-pointer bg-[#FFFFFF]"
              >
                {isFloorIsolated ? 'EXPLODED STACK' : 'ISOLATE LEVEL 04'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= 2. COMPACT CATEGORY FILTER STRIP (CAMPUS VIEW) ================= */}
      {spatialViewLevel === 'CAMPUS' && (
        <div
          id="campus-filter-strip"
          className="z-20 w-full bg-[#F2F0E9] border-b border-[#C9C6BC] px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0"
        >
          <div className="flex items-center divide-x divide-[#C9C6BC] border border-[#C9C6BC] bg-[#FFFFFF] shadow-sm">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#121212] text-[#FFFFFF] font-bold'
                      : 'text-[#696861] hover:text-[#121212] hover:bg-[#F2F0E9]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#696861]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#257A55]" />
              <span className="font-bold text-[#257A55]">ROUTE ACTIVE</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#F04B23]" />
              <span className="font-bold text-[#F04B23]">3 LIVE EVENTS</span>
            </span>
          </div>
        </div>
      )}

      {/* ================= 3. CENTRAL 3D SPATIAL CANVAS ================= */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Main React Three Fiber 3D Canvas */}
        <CampusCanvas3D
          spatialViewLevel={spatialViewLevel}
          selectedLandmarkId={selectedLandmark?.id || null}
          selectedEventId={selectedEventId}
          selectedFloorId={selectedFloor.number}
          selectedRoomCode={selectedRoom.code}
          isFloorIsolated={isFloorIsolated}
          isRoutingIndoor={isRoutingIndoor}
          activeCategory={selectedCategory}
          onSelectLandmark={onSelectLandmark}
          onSelectEvent={onSelectCampusEvent}
          onSelectFloor={handleSelectFloor3D}
          onSelectRoom={handleSelectRoom3D}
          onEnterBuilding={onEnterAcademicBlock}
          onReturnToCampus={() => onNavigateHierarchy('CAMPUS')}
        />

        {/* Vertical Floor Level Switcher (Visible in Building / Floor Mode) */}
        {spatialViewLevel !== 'CAMPUS' && (
          <div
            id="vertical-floor-index"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col bg-[#FFFFFF] border border-[#121212] shadow-md select-none"
          >
            <div className="px-2 py-1 bg-[#121212] text-[#FFFFFF] text-[9px] font-mono text-center uppercase tracking-wider">
              FLOORS
            </div>
            {floors.map((fl) => {
              const isSelected = selectedFloor.id === fl.id;
              const isDestination = fl.number === '04';

              return (
                <button
                  key={fl.id}
                  type="button"
                  onClick={() => {
                    onSelectFloor(fl);
                    onNavigateHierarchy('FLOOR', fl);
                  }}
                  className={`w-11 h-9 flex items-center justify-center font-mono text-xs font-bold transition-colors border-b border-[#C9C6BC] last:border-b-0 cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#153E90] text-[#FFFFFF]'
                      : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#E8E5DC]'
                  }`}
                  title={`Level ${fl.number} — ${fl.functionLabel}`}
                >
                  <span>{fl.number}</span>
                  {isDestination && !isSelected && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F04B23]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= 4. BOTTOM ARCHITECTURAL INFORMATION STRIP ================= */}
      <div className="px-6 py-2.5 border-t border-[#C9C6BC] flex flex-wrap items-center justify-between text-xs font-mono text-[#121212] z-20 bg-[#F2F0E9] shrink-0">
        <div className="flex items-center gap-2">
          {spatialViewLevel === 'CAMPUS' ? (
            <>
              <span className="font-bold text-[#121212] tracking-tight">
                {selectedLandmark ? selectedLandmark.name : 'SRM UNIVERSITY AP CAMPUS'}
              </span>
              <span className="text-[#696861]">·</span>
              <span className="text-[#696861]">
                {selectedLandmark
                  ? `STATUS: ${selectedLandmark.operatingStatus}`
                  : 'DIGITAL TWIN WAYFINDING MAQUETTE'}
              </span>
            </>
          ) : (
            <>
              <span className="font-bold text-[#121212] tracking-tight">
                {building.name}
              </span>
              <span className="text-[#696861]">·</span>
              <span className="text-[#153E90] font-bold">
                LEVEL {selectedFloor.number}: {selectedFloor.functionLabel}
              </span>
              <span className="text-[#696861]">·</span>
              <span className="text-[#257A55] font-semibold">{building.status}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-[#696861] text-[11px]">
          {spatialViewLevel === 'CAMPUS' ? (
            <>
              <span>GRID: 1000 × 700 M</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">
                PROJECTION: FIXED ARCHITECTURAL ISOMETRIC (40° TILT)
              </span>
            </>
          ) : (
            <>
              <span>HOURS: {building.hours}</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">
                ACTIVE VIEW: {isFloorIsolated ? 'ISOLATED LEVEL' : 'EXPLODED STACK'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
