import React from 'react';
import { Compass, Eye, Navigation, ArrowUpRight, ArrowRight, Calendar, MapPin, CheckSquare } from 'lucide-react';
import {
  Room,
  Floor,
  WayfindingEvent,
  CampusLandmark,
  CampusEventItem,
  SpatialViewLevel,
} from '../types';

interface RightContextPanelProps {
  spatialViewLevel: SpatialViewLevel;
  selectedLandmark: CampusLandmark | null;
  selectedRoom: Room;
  selectedFloor: Floor;
  activeEvent: CampusEventItem | null;
  isRouting: boolean;
  onToggleRoute: () => void;
  onEnterBuilding?: () => void;
  onViewFloor?: () => void;
  isFloorIsolated?: boolean;
  onSelectEvent: (event: CampusEventItem) => void;
  activeContextType: 'landmark' | 'room' | 'event';
  onNavigateToRoomIndoor: () => void;
}

export const RightContextPanel: React.FC<RightContextPanelProps> = ({
  spatialViewLevel,
  selectedLandmark,
  selectedRoom,
  selectedFloor,
  activeEvent,
  isRouting,
  onToggleRoute,
  onEnterBuilding,
  onViewFloor,
  isFloorIsolated,
  onSelectEvent,
  activeContextType,
  onNavigateToRoomIndoor,
}) => {
  // ================= MODE 1: EVENT DOSSIER CONTEXT =================
  if (activeContextType === 'event' && activeEvent) {
    return (
      <div
        id="context-panel"
        className="w-full md:w-[320px] h-full flex flex-col bg-[#F2F0E9] border-l border-[#C9C6BC] select-none overflow-y-auto"
      >
        {/* PANEL HEADING */}
        <div className="p-5 border-b border-[#C9C6BC]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-[#696861] uppercase tracking-widest">
              CAMPUS EVENT DOSSIER
            </span>
            <span className="w-5 h-5 bg-[#F04B23] text-[#FFFFFF] font-mono font-bold text-xs flex items-center justify-center">
              {activeEvent.markerNumber}
            </span>
          </div>
          <h1 className="text-lg font-mono font-bold tracking-tight text-[#121212] leading-tight mb-1">
            {activeEvent.title}
          </h1>
          <div className="text-xs font-semibold text-[#696861] tracking-wide uppercase">
            {activeEvent.venue}
          </div>
        </div>

        {/* SECTION: SCHEDULE & TIME */}
        <div className="p-4 border-b border-[#C9C6BC]">
          <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
            TIME & VENUE
          </div>
          <div className="text-base font-mono font-bold text-[#F04B23]">
            {activeEvent.time}
          </div>
          <div className="text-xs font-mono text-[#696861] mt-0.5">
            {activeEvent.date}
          </div>
          <div className="text-xs font-mono text-[#153E90] mt-1 font-semibold">
            {activeEvent.venue}
          </div>
        </div>

        {/* SECTION: ORGANIZER */}
        <div className="p-4 border-b border-[#C9C6BC]">
          <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
            ORGANIZING BODY
          </div>
          <div className="text-xs font-bold text-[#121212] uppercase tracking-tight">
            {activeEvent.organizer}
          </div>
          <div className="text-[11px] text-[#696861] mt-1.5 font-mono leading-relaxed">
            {activeEvent.description}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="p-4 border-b border-[#C9C6BC] space-y-2">
          <button
            type="button"
            onClick={() => {
              if (activeEvent.landmarkId === 'AB-01' && onNavigateToRoomIndoor) {
                onNavigateToRoomIndoor();
              } else {
                onToggleRoute();
              }
            }}
            className="w-full h-10 px-4 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider bg-[#257A55] hover:bg-[#1f6646] text-[#FFFFFF] border border-[#257A55] transition-colors cursor-pointer"
          >
            <span>SHOW ROUTE</span>
            <Navigation className="w-3.5 h-3.5" />
          </button>

          {activeEvent.landmarkId === 'AB-01' && onEnterBuilding && (
            <button
              type="button"
              onClick={onEnterBuilding}
              className="w-full h-9 px-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#E8E5DC] text-[#121212] border border-[#C9C6BC] transition-colors cursor-pointer"
            >
              <span>EXPLORE ACADEMIC BLOCK</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#153E90]" />
            </button>
          )}

          <button
            type="button"
            className="w-full h-9 px-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider bg-[#121212] hover:bg-[#153E90] text-[#FFFFFF] border border-[#121212] transition-colors cursor-pointer"
          >
            <span>{activeEvent.actionText}</span>
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-[#C9C6BC] bg-[#E8E5DC]/30 text-[10px] font-mono text-[#696861] flex items-center justify-between mt-auto">
          <span>EVENT ID: {activeEvent.id}</span>
          <span className="text-[#F04B23] font-bold">STATUS: CONFIRMED</span>
        </div>
      </div>
    );
  }

  // ================= MODE 2: CAMPUS LANDMARK CONTEXT (CAMPUS VIEW) =================
  if (spatialViewLevel === 'CAMPUS' && selectedLandmark && activeContextType === 'landmark') {
    const isAcademic = selectedLandmark.id === 'AB-01';

    return (
      <div
        id="context-panel"
        className="w-full md:w-[320px] h-full flex flex-col bg-[#F2F0E9] border-l border-[#C9C6BC] select-none overflow-y-auto"
      >
        {/* PANEL HEADING */}
        <div className="p-5 border-b border-[#C9C6BC]">
          <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
            CAMPUS LANDMARK · {selectedLandmark.category}
          </div>
          <h1 className="text-xl font-mono font-bold tracking-tight text-[#121212] leading-tight mb-1">
            {selectedLandmark.name}
          </h1>
          <div className="text-xs font-mono font-semibold text-[#153E90] tracking-wide uppercase">
            CODE: {selectedLandmark.code}
          </div>
        </div>

        {/* SECTION: OPERATING STATUS */}
        <div className="p-4 border-b border-[#C9C6BC]">
          <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-0.5">
            OPERATING STATUS
          </div>
          <div className="text-sm font-mono font-bold text-[#257A55]">
            {selectedLandmark.operatingStatus}
          </div>
          <div className="text-[11px] text-[#696861] mt-1.5 font-mono leading-relaxed">
            {selectedLandmark.description}
          </div>
        </div>

        {/* SECTION: DESTINATION HIGHLIGHT (IF ACADEMIC BLOCK) */}
        {isAcademic && (
          <div className="p-4 border-b border-[#C9C6BC] bg-[#E8EEF8]/70">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#F04B23]" />
              <span className="text-[10px] font-mono font-bold text-[#F04B23] uppercase tracking-wider">
                NEXT CLASS DESTINATION
              </span>
            </div>
            <div className="text-xs font-bold text-[#121212]">
              BIG DATA ESSENTIALS (09:30)
            </div>
            <div className="text-[11px] font-mono text-[#153E90] mt-0.5">
              LH 406 · LEVEL 04
            </div>
          </div>
        )}

        {/* SECTION: AVAILABLE FACILITIES */}
        <div className="p-4 border-b border-[#C9C6BC]">
          <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-2">
            AVAILABLE FACILITIES
          </div>
          <div className="space-y-1.5">
            {selectedLandmark.availableFacilities.map((fac) => (
              <div key={fac} className="flex items-center gap-2 text-xs font-mono text-[#121212]">
                <span className="w-1.5 h-1.5 bg-[#153E90]" />
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="p-4 border-b border-[#C9C6BC] space-y-2">
          {/* ENTER BUILDING (When indoor data exists) */}
          {selectedLandmark.hasIndoorMap && onEnterBuilding && (
            <button
              type="button"
              onClick={onEnterBuilding}
              className="w-full h-10 px-4 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider bg-[#153E90] hover:bg-[#122e6b] text-[#FFFFFF] border border-[#153E90] transition-colors cursor-pointer"
            >
              <span>ENTER BUILDING</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* START ROUTE ACTION */}
          <button
            type="button"
            onClick={onToggleRoute}
            className={`w-full h-9 px-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
              isRouting
                ? 'bg-[#257A55] text-[#FFFFFF] border-[#257A55]'
                : 'bg-[#121212] hover:bg-[#153E90] text-[#FFFFFF] border-[#121212]'
            }`}
          >
            <span>{isRouting ? 'CAMPUS ROUTE ACTIVE' : 'START CAMPUS ROUTE'}</span>
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-[#C9C6BC] bg-[#E8E5DC]/30 text-[10px] font-mono text-[#696861] flex items-center justify-between mt-auto">
          <span>NODE: {selectedLandmark.routeNodeId}</span>
          <span>SRM-WAYFINDING</span>
        </div>
      </div>
    );
  }

  // ================= MODE 3: INDOOR ROOM CONTEXT (ACADEMIC BLOCK CUTAWAY) =================
  return (
    <div
      id="context-panel"
      className="w-full md:w-[320px] h-full flex flex-col bg-[#F2F0E9] border-l border-[#C9C6BC] select-none overflow-y-auto"
    >
      {/* PANEL HEADING */}
      <div className="p-5 border-b border-[#C9C6BC]">
        <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
          INDOOR DESTINATION
        </div>
        <h1 className="text-2xl font-mono font-bold tracking-tight text-[#121212] leading-none mb-1">
          {selectedRoom.code}
        </h1>
        <div className="text-xs font-semibold text-[#696861] tracking-wide uppercase">
          {selectedRoom.name}
        </div>
      </div>

      {/* SECTION: LEVEL */}
      <div className="p-4 border-b border-[#C9C6BC]">
        <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-0.5">
          LEVEL
        </div>
        <div className="text-xl font-mono font-bold text-[#153E90]">
          {selectedFloor.number}
        </div>
        <div className="text-[11px] font-mono text-[#696861] uppercase mt-0.5">
          {selectedFloor.functionLabel}
        </div>
      </div>

      {/* SECTION: NEXT SESSION */}
      <div className="p-4 border-b border-[#C9C6BC]">
        <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
          NEXT SESSION
        </div>
        <div className="text-sm font-bold text-[#121212] leading-snug">
          {selectedRoom.nextSession?.title || 'GENERAL STUDY / OPEN LAB'}
        </div>
        <div className="text-xs font-mono text-[#696861] mt-1">
          {selectedRoom.nextSession?.timeRange || 'OPEN ACCESS'}
        </div>
      </div>

      {/* SECTION: FACULTY */}
      <div className="p-4 border-b border-[#C9C6BC]">
        <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
          FACULTY
        </div>
        <div className="text-xs font-bold text-[#121212] uppercase tracking-tight">
          {selectedRoom.faculty || 'FACULTY OF ENGINEERING & TECH'}
        </div>
        <div className="text-[11px] font-mono text-[#696861] mt-0.5">
          CAPACITY: {selectedRoom.capacity} SEATS
        </div>
      </div>

      {/* SECTION: DIRECTIONS */}
      <div className="p-4 border-b border-[#C9C6BC]">
        <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
          DIRECTIONS
        </div>
        <div className="text-xs font-mono font-medium text-[#121212] leading-relaxed">
          {selectedRoom.directions}
        </div>
      </div>

      {/* TWO RECTANGULAR ACTIONS */}
      <div className="p-4 border-b border-[#C9C6BC] space-y-2">
        <button
          type="button"
          onClick={onToggleRoute}
          className={`w-full h-10 px-4 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
            isRouting
              ? 'bg-[#257A55] text-[#FFFFFF] border-[#257A55]'
              : 'bg-[#121212] hover:bg-[#153E90] text-[#FFFFFF] border-[#121212]'
          }`}
        >
          <span>{isRouting ? 'ROUTE ACTIVE' : 'START ROUTE'}</span>
          <Navigation className="w-3.5 h-3.5" />
        </button>

        {onViewFloor && (
          <button
            type="button"
            onClick={onViewFloor}
            className="w-full h-9 px-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#E8E5DC] text-[#121212] border border-[#C9C6BC] transition-colors cursor-pointer"
          >
            <span>{isFloorIsolated ? 'EXPLODED VIEW' : 'VIEW FLOOR'}</span>
            <Eye className="w-3.5 h-3.5 text-[#153E90]" />
          </button>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-[#C9C6BC] bg-[#E8E5DC]/30 text-[10px] font-mono text-[#696861] flex items-center justify-between mt-auto">
        <span>LOC: 12.8231° N 80.0442° E</span>
        <span>GRID: SR-406</span>
      </div>
    </div>
  );
};
