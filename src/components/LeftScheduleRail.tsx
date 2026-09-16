import React from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { TransitStation } from '../types';

interface LeftScheduleRailProps {
  schedule: TransitStation[];
  selectedRoomCode?: string;
  onLocateRoom: (roomCode: string, floorId: string) => void;
}

export const LeftScheduleRail: React.FC<LeftScheduleRailProps> = ({
  schedule,
  selectedRoomCode,
  onLocateRoom,
}) => {
  // Identify next class (default LH 406)
  const nextClass = schedule.find((s) => s.status === 'NEXT') || schedule[1];

  return (
    <div
      id="schedule-rail"
      className="w-full md:w-[280px] h-full flex flex-col bg-[#F2F0E9] border-r border-[#C9C6BC] select-none overflow-y-auto"
    >
      {/* RAIL HEADER */}
      <div className="p-4 border-b border-[#C9C6BC]">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold tracking-widest text-[#121212] uppercase">
            TODAY / MONDAY
          </h2>
          <span className="text-[10px] font-mono text-[#696861] uppercase">
            {schedule.length} SESSIONS
          </span>
        </div>
      </div>

      {/* TOP CALLOUT: NEXT CLASS */}
      {nextClass && (
        <div className="p-4 border-b border-[#C9C6BC] bg-[#E8E5DC]/50">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 bg-[#F04B23]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#F04B23] uppercase">
              NEXT
            </span>
          </div>

          <div className="text-base font-extrabold tracking-tight text-[#121212] leading-tight mb-1">
            {nextClass.subject}
          </div>

          <div className="font-mono text-xl font-bold text-[#121212] mb-1">
            {nextClass.time}
          </div>

          <div className="text-xs font-mono text-[#696861] mb-3">
            {nextClass.roomCode} · ACADEMIC BLOCK · LEVEL {nextClass.floorId}
          </div>

          <button
            type="button"
            onClick={() => onLocateRoom(nextClass.roomCode, nextClass.floorId)}
            className="w-full h-8 px-3 bg-[#121212] hover:bg-[#153E90] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>LOCATE ROOM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TRANSIT TIMELINE */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase text-[#696861] tracking-wider mb-3">
          TRANSIT SCHEDULE
        </div>

        <div className="relative pl-6">
          {/* Continuous vertical transit backbone line */}
          <div className="absolute left-[7px] top-2 bottom-4 w-[2px] bg-[#C9C6BC]" />

          <div className="space-y-6">
            {schedule.map((station) => {
              const isCompleted = station.status === 'COMPLETED';
              const isNow = station.status === 'NOW';
              const isNext = station.status === 'NEXT';
              const isSelected = selectedRoomCode === station.roomCode;

              // Color styles according to specifications:
              // Current class: SRM blue (#153E90)
              // Next class: active orange (#F04B23)
              // Completed: muted (#696861)
              let dotColor = 'bg-[#FFFFFF] border-2 border-[#696861]';
              let badgeColor = 'text-[#696861] border-[#C9C6BC]';
              let titleColor = 'text-[#121212]';

              if (isNext) {
                dotColor = 'bg-[#F04B23] border-2 border-[#121212] animate-pulse';
                badgeColor = 'text-[#F04B23] border-[#F04B23] bg-[#F04B23]/10 font-bold';
                titleColor = 'text-[#121212] font-bold';
              } else if (isNow) {
                dotColor = 'bg-[#153E90] border-2 border-[#121212]';
                badgeColor = 'text-[#153E90] border-[#153E90] bg-[#153E90]/10 font-bold';
                titleColor = 'text-[#153E90] font-bold';
              } else if (isCompleted) {
                dotColor = 'bg-[#C9C6BC] border-2 border-[#696861]';
                badgeColor = 'text-[#696861] border-[#C9C6BC] line-through';
                titleColor = 'text-[#696861]';
              }

              return (
                <div
                  key={station.id}
                  onClick={() => onLocateRoom(station.roomCode, station.floorId)}
                  className={`relative cursor-pointer group transition-colors ${
                    isSelected ? 'pl-2 -ml-2 bg-[#E8EEF8]/60 py-1' : ''
                  }`}
                >
                  {/* Station node dot on the vertical continuous line */}
                  <div
                    className={`absolute -left-[24px] top-1 w-3.5 h-3.5 ${dotColor} transition-transform group-hover:scale-125`}
                  />

                  {/* Station Details */}
                  <div className="flex items-baseline justify-between gap-1 mb-0.5">
                    <span className="font-mono text-xs font-semibold tracking-tight text-[#121212]">
                      {station.time}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1 py-0.2 border ${badgeColor}`}
                    >
                      {station.status}
                    </span>
                  </div>

                  <div className={`text-xs leading-snug tracking-tight ${titleColor}`}>
                    {station.subject}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#696861]">
                    <span className="font-semibold text-[#153E90]">{station.roomCode}</span>
                    <span>·</span>
                    <span>LEVEL {station.floorId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER NOTICE */}
      <div className="p-3 border-t border-[#C9C6BC] text-[10px] font-mono text-[#696861] flex items-center justify-between">
        <span>SRM WAYFINDING v2.4</span>
        <span className="text-[#257A55] font-semibold">ALL LIFTS OPERATIONAL</span>
      </div>
    </div>
  );
};
