import React, { useState, useEffect } from 'react';
import { Search, Upload, X, MapPin, Layers, Calendar, User, ArrowRight } from 'lucide-react';
import {
  StudentProfile,
  Floor,
  Room,
  CampusLandmark,
  CampusEventItem,
} from '../types';
import { CAMPUS_LANDMARKS, CAMPUS_EVENTS_DATA } from '../data/campusMasterData';

interface SearchResultEntry {
  id: string;
  title: string;
  code?: string;
  categoryLabel: string;
  hierarchicalPath: string;
  type: 'landmark' | 'room' | 'event' | 'faculty';
  landmark?: CampusLandmark;
  floor?: Floor;
  room?: Room;
  event?: CampusEventItem;
}

interface TopUtilityBarProps {
  student: StudentProfile;
  floors: Floor[];
  onSelectRoom: (room: Room, floor: Floor) => void;
  onSelectLandmark: (landmark: CampusLandmark) => void;
  onSelectEvent: (event: CampusEventItem) => void;
  onOpenUpload: () => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  student,
  floors,
  onSelectRoom,
  onSelectLandmark,
  onSelectEvent,
  onOpenUpload,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Live real-time clock in IBM Plex Mono format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}:${secs}`);

      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
      ];
      setCurrentDate(`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global hierarchical search across Campus landmarks, Floors, Rooms, Faculty & Events
  const searchResults: SearchResultEntry[] = [];
  if (searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();

    // 1. Match Campus Landmarks
    CAMPUS_LANDMARKS.forEach((lm) => {
      if (
        lm.name.toLowerCase().includes(q) ||
        lm.code.toLowerCase().includes(q) ||
        lm.shortLabel.toLowerCase().includes(q) ||
        lm.category.toLowerCase().includes(q)
      ) {
        searchResults.push({
          id: `lm-${lm.id}`,
          title: lm.name,
          code: lm.code,
          categoryLabel: 'BUILDING',
          hierarchicalPath: `Campus / ${lm.name}`,
          type: 'landmark',
          landmark: lm,
        });
      }
    });

    // 2. Match Campus Events
    CAMPUS_EVENTS_DATA.forEach((ev) => {
      if (
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.organizer.toLowerCase().includes(q) ||
        q.includes('cloud') ||
        q.includes('meetup') ||
        q.includes('audition') ||
        q.includes('tournament')
      ) {
        searchResults.push({
          id: `ev-${ev.id}`,
          title: ev.title,
          code: `EVENT #${ev.markerNumber}`,
          categoryLabel: 'EVENT',
          hierarchicalPath: `Campus / ${ev.venue}`,
          type: 'event',
          event: ev,
        });
      }
    });

    // 3. Match Rooms, Labs, Faculty, and HOD offices inside Academic Block
    floors.forEach((f) => {
      f.rooms.forEach((r) => {
        const matchesCode = r.code.toLowerCase().includes(q);
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesFaculty = r.faculty && r.faculty.toLowerCase().includes(q);
        const matchesSession = r.nextSession && r.nextSession.title.toLowerCase().includes(q);
        const matchesHOD = (q.includes('hod') || q.includes('dean') || q.includes('cse')) &&
          (r.code === 'ADM 501' || r.code === 'ADM 504' || r.name.includes("DEAN"));
        const matchesPhysics = q.includes('physic') && (r.code === 'LH 406' || r.code === 'SCI 412' || f.id === '04');

        if (matchesCode || matchesName || matchesFaculty || matchesSession || matchesHOD || matchesPhysics) {
          let wing = 'Lecture Wing';
          if (r.type === 'science') wing = 'Science Wing';
          if (r.type === 'admin') wing = 'Administration';
          if (r.type === 'library') wing = 'Knowledge Commons';
          if (r.type === 'seminar') wing = 'Seminar Suite';

          searchResults.push({
            id: `rm-${r.code}`,
            title: matchesFaculty ? `${r.faculty} (${r.code})` : r.name,
            code: r.code,
            categoryLabel: matchesFaculty ? 'FACULTY' : 'ROOM',
            hierarchicalPath: `Academic Block / Level ${f.number} / ${wing}`,
            type: 'room',
            floor: f,
            room: r,
          });
        }
      });
    });
  }

  const handleSelectEntry = (entry: SearchResultEntry) => {
    setSearchOpen(false);
    setSearchQuery('');

    if (entry.type === 'landmark' && entry.landmark) {
      onSelectLandmark(entry.landmark);
    } else if (entry.type === 'room' && entry.room && entry.floor) {
      onSelectRoom(entry.room, entry.floor);
    } else if (entry.type === 'event' && entry.event) {
      onSelectEvent(entry.event);
    }
  };

  return (
    <header
      id="utility-bar"
      className="h-16 w-full bg-[#F2F0E9] border-b border-[#C9C6BC] px-4 md:px-6 flex items-center justify-between select-none z-30 shrink-0"
    >
      {/* LEFT: Wordmark + Live Date/Time */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base lg:text-lg tracking-tight text-[#121212]">
            CAMPUS<span className="text-[#153E90]">/</span>OS
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-[#696861] px-1.5 py-0.5 border border-[#C9C6BC]">
            WAYFINDING
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#696861] pl-4 border-l border-[#C9C6BC]">
          <span className="font-semibold text-[#121212]">{currentDate}</span>
          <span>·</span>
          <span className="text-[#153E90] tabular-nums font-semibold">{currentTime}</span>
        </div>
      </div>

      {/* CENTER: Universal Hierarchical Search Field */}
      <div className="relative flex-1 max-w-xs sm:max-w-md mx-3">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#696861] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search campus building, room, faculty, or event (e.g. LH 406)..."
            className="w-full h-9 pl-8 pr-8 bg-[#FFFFFF] border border-[#C9C6BC] focus:border-[#121212] text-xs font-mono text-[#121212] placeholder-[#696861]/70 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              className="absolute right-2.5 text-[#696861] hover:text-[#121212] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Hierarchical Search Results Dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-10 left-0 right-0 bg-[#FFFFFF] border border-[#121212] shadow-xl max-h-80 overflow-y-auto z-50">
            <div className="px-3 py-1.5 bg-[#F2F0E9] border-b border-[#C9C6BC] text-[10px] font-mono uppercase text-[#696861] tracking-wider flex items-center justify-between">
              <span>{searchResults.length} HIERARCHICAL MATCHES</span>
              <span>PRESS TO LOCATE</span>
            </div>
            {searchResults.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => handleSelectEntry(entry)}
                className="w-full px-3 py-2 text-left hover:bg-[#F2F0E9] border-b border-[#E8E5DC] flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    {entry.code && (
                      <span className="font-mono text-xs font-bold text-[#153E90] group-hover:text-[#121212]">
                        {entry.code}
                      </span>
                    )}
                    <span className="text-xs text-[#121212] font-semibold">{entry.title}</span>
                  </div>
                  {/* Hierarchical Location Path display */}
                  <div className="text-[11px] text-[#696861] font-mono mt-0.5 flex items-center gap-1">
                    <span className="text-[#153E90]">↳</span>
                    <span>{entry.hierarchicalPath}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-[#C9C6BC] text-[#696861] group-hover:border-[#121212] group-hover:text-[#121212]">
                    {entry.categoryLabel}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9C6BC] group-hover:text-[#153E90]" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Upload Timetable Action + Student Identifier */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          type="button"
          onClick={onOpenUpload}
          className="hidden sm:flex items-center gap-1.5 h-8 px-3 bg-[#FFFFFF] hover:bg-[#121212] text-[#121212] hover:text-[#FFFFFF] border border-[#C9C6BC] hover:border-[#121212] text-xs font-medium transition-colors cursor-pointer"
        >
          <Upload className="w-3 h-3 text-[#153E90]" />
          <span>Upload timetable</span>
        </button>

        {/* Student Identifier */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#C9C6BC]">
          <div className="w-7 h-7 bg-[#153E90] text-[#FFFFFF] font-mono font-bold text-xs flex items-center justify-center">
            {student.avatarText}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold tracking-tight text-[#121212] leading-none">
              {student.name}
            </div>
            <div className="text-[10px] font-mono text-[#696861] mt-0.5 leading-none">
              {student.idNumber} · {student.department}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
