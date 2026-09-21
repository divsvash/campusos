import {
  ParsedTimetable,
  ParsedTimetableSession,
  TransitStation,
  Weekday,
} from '../types';

const WEEKDAYS: Weekday[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const DAY_INDEX: Record<number, Weekday | undefined> = {
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const stringValue = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value.trim() : fallback;

const stringArray = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => stringValue(item)).filter(Boolean) : [];

const validTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export function inferFloorId(roomCode: string): string | null {
  const normalized = roomCode.trim().toUpperCase();
  if (!normalized) return null;

  const explicitLevel = normalized.match(/(?:LEVEL|FLOOR)\s*0?([0-5])/);
  if (explicitLevel) return explicitLevel[1].padStart(2, '0');

  const lectureRoom = normalized.match(/\b(?:LH|ROOM|RM)\s*[- ]?([0-5])\d{2}\b/);
  if (lectureRoom) return lectureRoom[1].padStart(2, '0');

  const numericLab = normalized.match(/\bLAB\s*0(\d{2})\b/);
  if (numericLab) return '00';

  return null;
}

export function normalizeParsedTimetable(input: unknown): ParsedTimetable {
  if (!isRecord(input)) throw new Error('Gemini returned an invalid timetable object.');

  const warnings = stringArray(input.warnings);
  const subjects = Array.isArray(input.subjects)
    ? input.subjects.flatMap((raw) => {
        if (!isRecord(raw)) return [];
        const code = stringValue(raw.code).toUpperCase();
        const name = stringValue(raw.name);
        if (!code || !name) return [];
        return [{ code, name, faculty: stringArray(raw.faculty) }];
      })
    : [];

  const sessions: ParsedTimetableSession[] = Array.isArray(input.sessions)
    ? input.sessions.flatMap((raw, index) => {
        if (!isRecord(raw)) return [];
        const day = stringValue(raw.day).toUpperCase() as Weekday;
        const startTime = stringValue(raw.startTime);
        const endTime = stringValue(raw.endTime);
        const subjectCode = stringValue(raw.subjectCode).toUpperCase();
        const subjectName = stringValue(raw.subjectName);
        const roomCode = stringValue(raw.roomCode).toUpperCase();
        const rawType = stringValue(raw.sessionType, 'OTHER').toUpperCase();
        const sessionType = ['LECTURE', 'LAB', 'TRAINING', 'OTHER'].includes(rawType)
          ? (rawType as ParsedTimetableSession['sessionType'])
          : 'OTHER';

        if (!WEEKDAYS.includes(day) || !validTime(startTime) || !validTime(endTime) || !subjectCode) {
          return [];
        }

        const suppliedFloor = stringValue(raw.floorId);
        const floorId = /^(00|01|02|03|04|05)$/.test(suppliedFloor)
          ? suppliedFloor
          : inferFloorId(roomCode);

        return [{
          id: stringValue(raw.id, `session-${index + 1}`),
          day,
          startTime,
          endTime,
          subjectCode,
          subjectName: subjectName || subjectCode,
          faculty: stringArray(raw.faculty),
          roomCode,
          floorId,
          sessionType,
        }];
      })
    : [];

  if (sessions.length === 0) {
    throw new Error('No valid class sessions were found in the uploaded timetable.');
  }

  return {
    course: stringValue(input.course),
    department: stringValue(input.department),
    semester: stringValue(input.semester),
    section: stringValue(input.section),
    defaultRoom: stringValue(input.defaultRoom).toUpperCase(),
    subjects,
    sessions: sessions.sort((a, b) =>
      WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day) || a.startTime.localeCompare(b.startTime)
    ),
    warnings,
  };
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function sessionsForDay(
  timetable: ParsedTimetable,
  now = new Date()
): { day: Weekday; stations: TransitStation[] } {
  const detectedDay = DAY_INDEX[now.getDay()];
  const availableDays = WEEKDAYS.filter((day) => timetable.sessions.some((session) => session.day === day));
  const day = detectedDay && availableDays.includes(detectedDay) ? detectedDay : availableDays[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sessions = timetable.sessions.filter((session) => session.day === day);

  let nextAssigned = false;
  const stations = sessions.map<TransitStation>((session) => {
    const start = toMinutes(session.startTime);
    const end = toMinutes(session.endTime);
    let status: TransitStation['status'];

    if (detectedDay === day && currentMinutes >= start && currentMinutes < end) {
      status = 'NOW';
    } else if (detectedDay === day && currentMinutes >= end) {
      status = 'COMPLETED';
    } else if (!nextAssigned) {
      status = 'NEXT';
      nextAssigned = true;
    } else {
      status = 'UPCOMING';
    }

    return {
      id: session.id,
      time: session.startTime,
      subject: session.subjectName,
      roomCode: session.roomCode || timetable.defaultRoom || 'ROOM TBD',
      buildingName: 'ACADEMIC BLOCK',
      floorId: session.floorId ?? '',
      status,
      faculty: session.faculty.join(' / ') || 'FACULTY TBD',
      timeRange: `${session.startTime}–${session.endTime}`,
    };
  });

  if (!stations.some((station) => station.status === 'NEXT') && !stations.some((station) => station.status === 'NOW')) {
    const upcoming = stations.find((station) => station.status !== 'COMPLETED');
    if (upcoming) upcoming.status = 'NEXT';
  }

  return { day, stations };
}
