import React, { useEffect, useState } from 'react';
import { TopUtilityBar } from './components/TopUtilityBar';
import { LeftScheduleRail } from './components/LeftScheduleRail';
import { CentralSpatialCanvas } from './components/CentralSpatialCanvas';
import { RightContextPanel } from './components/RightContextPanel';
import { UploadTimetableModal } from './components/UploadTimetableModal';
import {
  STUDENT_PROFILE,
  BUILDING_DATA,
  FLOORS_DATA,
  TODAY_SCHEDULE,
  NEARBY_EVENT,
} from './data/wayfindingData';
import {
  CAMPUS_LANDMARKS,
  CAMPUS_EVENTS_DATA,
} from './data/campusMasterData';
import {
  Floor,
  Room,
  CampusLandmark,
  CampusCategory,
  CampusEventItem,
  SpatialViewLevel,
  ParsedTimetable,
  TransitStation,
  Weekday,
} from './types';
import { normalizeParsedTimetable, sessionsForDay } from './lib/timetable';
import { Calendar, ChevronDown, ChevronUp, Navigation, ArrowRight, Layers } from 'lucide-react';

export default function App() {
  const [schedule, setSchedule] = useState<TransitStation[]>(TODAY_SCHEDULE);
  const [scheduleDay, setScheduleDay] = useState<Weekday>('MONDAY');

  useEffect(() => {
    const saved = localStorage.getItem('campusos.timetable');
    if (!saved) return;
    try {
      const timetable = normalizeParsedTimetable(JSON.parse(saved));
      const current = sessionsForDay(timetable);
      setSchedule(current.stations);
      setScheduleDay(current.day);
    } catch {
      localStorage.removeItem('campusos.timetable');
    }
  }, []);

  // ================= 1. HIERARCHICAL SPATIAL STATE =================
  // Initial demo state: Opens in CAMPUS view
  const [spatialViewLevel, setSpatialViewLevel] = useState<SpatialViewLevel>('CAMPUS');

  // Campus state:
  // Default selected landmark: Academic Block (where next class is)
  const defaultLandmark =
    CAMPUS_LANDMARKS.find((lm) => lm.id === 'AB-01') || CAMPUS_LANDMARKS[0];
  const [selectedLandmark, setSelectedLandmark] = useState<CampusLandmark | null>(defaultLandmark);
  const [selectedCategory, setSelectedCategory] = useState<CampusCategory>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<CampusEventItem | null>(null);
  const [isRoutingCampus, setIsRoutingCampus] = useState<boolean>(true); // Initial state shows route from Main Entrance to Academic Block

  // Building & Indoor Floor/Room state:
  const defaultFloor = FLOORS_DATA.find((f) => f.id === '04') || FLOORS_DATA[1];
  const defaultRoom = defaultFloor.rooms.find((r) => r.code === 'LH 406') || defaultFloor.rooms[0];
  const [selectedFloor, setSelectedFloor] = useState<Floor>(defaultFloor);
  const [selectedRoom, setSelectedRoom] = useState<Room>(defaultRoom);
  const [isFloorIsolated, setIsFloorIsolated] = useState<boolean>(false);
  const [isRoutingIndoor, setIsRoutingIndoor] = useState<boolean>(true);

  // Context panel mode: 'landmark' | 'room' | 'event'
  const [activeContextType, setActiveContextType] = useState<'landmark' | 'room' | 'event'>('landmark');

  // Upload Timetable Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Mobile Bottom Drawer / Sheet states
  const [mobileScheduleDrawerOpen, setMobileScheduleDrawerOpen] = useState(false);
  const [mobileContextSheetOpen, setMobileContextSheetOpen] = useState(false);

  // ================= 2. EVENT & SELECTION HANDLERS =================

  // Handle clicking a campus landmark (e.g. from canvas or search)
  const handleSelectLandmark = (landmark: CampusLandmark) => {
    setSelectedLandmark(landmark);
    setActiveEvent(null);
    setSelectedEventId(null);
    setActiveContextType('landmark');
    if (landmark.id === 'AB-01') {
      setIsRoutingCampus(true);
    }
    setMobileContextSheetOpen(true);
  };

  // Handle clicking an event marker (e.g. #1, #2, #3)
  const handleSelectCampusEvent = (event: CampusEventItem) => {
    setActiveEvent(event);
    setSelectedEventId(event.id);
    setActiveContextType('event');
    const hostLandmark = CAMPUS_LANDMARKS.find((lm) => lm.id === event.landmarkId);
    if (hostLandmark) {
      setSelectedLandmark(hostLandmark);
    }
    setMobileContextSheetOpen(true);
  };

  // Handle indoor event click inside building cutaway
  const handleSelectIndoorEvent = () => {
    const indoorEv = CAMPUS_EVENTS_DATA.find((e) => e.id === 'ev-01');
    if (indoorEv) {
      setActiveEvent(indoorEv);
      setSelectedEventId(indoorEv.id);
      setActiveContextType('event');
    }
    setMobileContextSheetOpen(true);
  };

  // Enter the Academic Block (Campus → Building Transition)
  const handleEnterAcademicBlock = () => {
    setSpatialViewLevel('BUILDING');
    setActiveContextType('room');
    setIsFloorIsolated(false);
    setIsRoutingIndoor(true);
  };

  // Navigate along the hierarchy (e.g. from breadcrumbs)
  const handleNavigateHierarchy = (
    level: SpatialViewLevel,
    floor?: Floor,
    room?: Room
  ) => {
    if (level === 'CAMPUS') {
      setSpatialViewLevel('CAMPUS');
      setActiveContextType('landmark');
      setIsFloorIsolated(false);
    } else if (level === 'BUILDING') {
      setSpatialViewLevel('BUILDING');
      setIsFloorIsolated(false);
      setActiveContextType('room');
    } else if (level === 'FLOOR') {
      setSpatialViewLevel('FLOOR');
      if (floor) setSelectedFloor(floor);
      setIsFloorIsolated(true);
      setActiveContextType('room');
    } else if (level === 'ROOM') {
      setSpatialViewLevel('ROOM');
      if (room && floor) {
        setSelectedFloor(floor);
        setSelectedRoom(room);
      }
      setActiveContextType('room');
    }
  };

  // Handle selecting an indoor floor
  const handleSelectFloor = (floor: Floor) => {
    setSelectedFloor(floor);
    if (!floor.rooms.some((r) => r.code === selectedRoom.code)) {
      if (floor.rooms.length > 0) {
        setSelectedRoom(floor.rooms[0]);
      }
    }
    setActiveContextType('room');
  };

  // Handle selecting an indoor room
  const handleSelectRoom = (room: Room, floor: Floor) => {
    // If we were in campus view, transition to building view
    setSpatialViewLevel('BUILDING');
    setSelectedFloor(floor);
    setSelectedRoom(room);
    setActiveContextType('room');
    setIsRoutingIndoor(true);
    setMobileContextSheetOpen(true);
  };

  // Handle Next-Class LOCATE ROOM action:
  // "When the user clicks LOCATE ROOM:
  // 1. Highlight the Academic Block on the campus map.
  // 2. Draw a green route from the current-location marker to the Academic Block.
  // 3. Update the right panel with the destination summary.
  // 4. Display an ENTER BUILDING action.
  // 5. After entering, transition to the academic-block cutaway.
  // 6. Select Level 04.
  // 7. Highlight LH 406.
  // 8. Draw the indoor route from the entrance, stair or lift core to the room.
  // Do not jump directly from the campus view to the room."
  const handleLocateRoom = (roomCode: string, floorId: string) => {
    if (spatialViewLevel === 'CAMPUS') {
      // 1. Highlight Academic Block on campus map
      const ab = CAMPUS_LANDMARKS.find((lm) => lm.id === 'AB-01');
      if (ab) setSelectedLandmark(ab);
      // 2. Draw green route from Main Entrance to Academic Block
      setIsRoutingCampus(true);
      // 3. Update right panel with landmark summary
      setActiveContextType('landmark');
      // Set destination floor & room ready for indoor transition
      const targetFloor = FLOORS_DATA.find((f) => f.id === floorId);
      if (targetFloor) {
        setSelectedFloor(targetFloor);
        const targetRoom = targetFloor.rooms.find((r) => r.code === roomCode);
        if (targetRoom) setSelectedRoom(targetRoom);
      }
    } else {
      // Already inside building: highlight floor and room
      const targetFloor = FLOORS_DATA.find((f) => f.id === floorId);
      if (targetFloor) {
        setSelectedFloor(targetFloor);
        const targetRoom = targetFloor.rooms.find((r) => r.code === roomCode);
        if (targetRoom) {
          setSelectedRoom(targetRoom);
          setActiveContextType('room');
          setIsRoutingIndoor(true);
        }
      }
    }
    setMobileScheduleDrawerOpen(false);
    setMobileContextSheetOpen(true);
  };

  const handleTimetableImported = (timetable: ParsedTimetable) => {
    const current = sessionsForDay(timetable);
    setSchedule(current.stations);
    setScheduleDay(current.day);
    localStorage.setItem('campusos.timetable', JSON.stringify(timetable));
  };

  const nextClass = schedule.find((s) => s.status === 'NEXT') || schedule.find((s) => s.status === 'NOW') || schedule[0];

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F2F0E9] text-[#121212] flex flex-col font-sans select-none antialiased">
      {/* ================= 64PX TOP UTILITY BAR ================= */}
      <TopUtilityBar
        student={STUDENT_PROFILE}
        floors={FLOORS_DATA}
        onSelectRoom={handleSelectRoom}
        onSelectLandmark={handleSelectLandmark}
        onSelectEvent={handleSelectCampusEvent}
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />

      {/* ================= MOBILE NEXT-CLASS ALERT BAR ================= */}
      <div className="md:hidden bg-[#E8E5DC] border-b border-[#C9C6BC] px-3 py-1.5 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 bg-[#F04B23] animate-pulse shrink-0" />
          <span className="text-[#121212] font-semibold truncate">
            NEXT: {nextClass?.subject || 'NO CLASS'} {nextClass ? `(${nextClass.time}) · ${nextClass.roomCode}` : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={() => nextClass && handleLocateRoom(nextClass.roomCode, nextClass.floorId)}
          className="ml-2 px-2 py-0.5 bg-[#121212] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer"
        >
          LOCATE →
        </button>
      </div>

      {/* ================= MAIN 3-COLUMN DESKTOP WORKSPACE ================= */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* 1. LEFT SCHEDULE RAIL (280px wide on desktop) */}
        <div className="hidden md:block h-full shrink-0">
          <LeftScheduleRail
            schedule={schedule}
            day={scheduleDay}
            selectedRoomCode={selectedRoom.code}
            onLocateRoom={handleLocateRoom}
          />
        </div>

        {/* 2. CENTRAL SPATIAL CANVAS (Dominates interface: Campus or Building Cutaway) */}
        <main className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
          <CentralSpatialCanvas
            spatialViewLevel={spatialViewLevel}
            onNavigateHierarchy={handleNavigateHierarchy}
            // Campus map props
            selectedLandmark={selectedLandmark}
            onSelectLandmark={handleSelectLandmark}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onEnterAcademicBlock={handleEnterAcademicBlock}
            selectedEventId={selectedEventId}
            onSelectCampusEvent={handleSelectCampusEvent}
            isRoutingCampus={isRoutingCampus}
            // Building cutaway props
            building={BUILDING_DATA}
            floors={FLOORS_DATA}
            selectedFloor={selectedFloor}
            selectedRoom={selectedRoom}
            onSelectFloor={handleSelectFloor}
            onSelectRoom={handleSelectRoom}
            isFloorIsolated={isFloorIsolated}
            onToggleIsolateFloor={() => setIsFloorIsolated(!isFloorIsolated)}
            isRoutingIndoor={isRoutingIndoor}
            nearbyEvent={NEARBY_EVENT}
            onSelectIndoorEvent={handleSelectIndoorEvent}
            activeContextType={activeContextType}
          />
        </main>

        {/* 3. RIGHT CONTEXT PANEL (320px wide on desktop) */}
        <div className="hidden md:block h-full shrink-0">
          <RightContextPanel
            spatialViewLevel={spatialViewLevel}
            selectedLandmark={selectedLandmark}
            selectedRoom={selectedRoom}
            selectedFloor={selectedFloor}
            activeEvent={activeEvent}
            isRouting={spatialViewLevel === 'CAMPUS' ? isRoutingCampus : isRoutingIndoor}
            onToggleRoute={() => {
              if (spatialViewLevel === 'CAMPUS') {
                setIsRoutingCampus(!isRoutingCampus);
              } else {
                setIsRoutingIndoor(!isRoutingIndoor);
              }
            }}
            onEnterBuilding={handleEnterAcademicBlock}
            onViewFloor={() => setIsFloorIsolated(!isFloorIsolated)}
            isFloorIsolated={isFloorIsolated}
            onSelectEvent={handleSelectCampusEvent}
            activeContextType={activeContextType}
            onNavigateToRoomIndoor={() => {
              handleEnterAcademicBlock();
              const sem404 = FLOORS_DATA.find((f) => f.id === '04')?.rooms.find((r) => r.code === 'SEM 404');
              if (sem404) {
                const f04 = FLOORS_DATA.find((f) => f.id === '04');
                if (f04) handleSelectRoom(sem404, f04);
              }
            }}
          />
        </div>

        {/* ================= MOBILE BOTTOM DRAWER & NAVIGATION BAR ================= */}
        <div className="md:hidden flex flex-col z-30 border-t border-[#121212] bg-[#F2F0E9] shrink-0">
          {/* Mobile Tab Toggles */}
          <div className="flex items-center divide-x divide-[#C9C6BC] border-b border-[#C9C6BC]">
            <button
              type="button"
              onClick={() => {
                setMobileScheduleDrawerOpen(!mobileScheduleDrawerOpen);
                setMobileContextSheetOpen(false);
              }}
              className={`flex-1 py-2 text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileScheduleDrawerOpen ? 'bg-[#121212] text-[#FFFFFF]' : 'text-[#121212]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>TIMELINE</span>
              {mobileScheduleDrawerOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileContextSheetOpen(!mobileContextSheetOpen);
                setMobileScheduleDrawerOpen(false);
              }}
              className={`flex-1 py-2 text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileContextSheetOpen ? 'bg-[#153E90] text-[#FFFFFF]' : 'text-[#121212]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>
                {activeContextType === 'event' && activeEvent
                  ? `EVENT #${activeEvent.markerNumber}`
                  : spatialViewLevel === 'CAMPUS' && selectedLandmark
                  ? selectedLandmark.code
                  : `${selectedRoom.code} DETAILS`}
              </span>
              {mobileContextSheetOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>

          {/* Expandable Mobile Schedule Drawer */}
          {mobileScheduleDrawerOpen && (
            <div className="max-h-72 overflow-y-auto border-t border-[#C9C6BC] bg-[#F2F0E9]">
              <LeftScheduleRail
                schedule={schedule}
                day={scheduleDay}
                selectedRoomCode={selectedRoom.code}
                onLocateRoom={handleLocateRoom}
              />
            </div>
          )}

          {/* Expandable Mobile Context Sheet */}
          {mobileContextSheetOpen && (
            <div className="max-h-80 overflow-y-auto border-t border-[#C9C6BC] bg-[#F2F0E9]">
              <RightContextPanel
                spatialViewLevel={spatialViewLevel}
                selectedLandmark={selectedLandmark}
                selectedRoom={selectedRoom}
                selectedFloor={selectedFloor}
                activeEvent={activeEvent}
                isRouting={spatialViewLevel === 'CAMPUS' ? isRoutingCampus : isRoutingIndoor}
                onToggleRoute={() => {
                  if (spatialViewLevel === 'CAMPUS') {
                    setIsRoutingCampus(!isRoutingCampus);
                  } else {
                    setIsRoutingIndoor(!isRoutingIndoor);
                  }
                }}
                onEnterBuilding={handleEnterAcademicBlock}
                onViewFloor={() => setIsFloorIsolated(!isFloorIsolated)}
                isFloorIsolated={isFloorIsolated}
                onSelectEvent={handleSelectCampusEvent}
                activeContextType={activeContextType}
                onNavigateToRoomIndoor={() => {
                  handleEnterAcademicBlock();
                  const sem404 = FLOORS_DATA.find((f) => f.id === '04')?.rooms.find((r) => r.code === 'SEM 404');
                  if (sem404) {
                    const f04 = FLOORS_DATA.find((f) => f.id === '04');
                    if (f04) handleSelectRoom(sem404, f04);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= TIMETABLE IMPORT MODAL ================= */}
      <UploadTimetableModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleTimetableImported}
      />
    </div>
  );
}
