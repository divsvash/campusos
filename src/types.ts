export type CampusCategory = 'ALL' | 'ACADEMIC' | 'EVENTS' | 'FOOD' | 'SPORTS' | 'SERVICES';

export type SpatialViewLevel = 'CAMPUS' | 'BUILDING' | 'FLOOR' | 'ROOM';

export interface CampusLandmark {
  id: string;
  code: string;
  name: string;
  shortLabel: string;
  category: 'ACADEMIC' | 'EVENTS' | 'FOOD' | 'SPORTS' | 'SERVICES';
  svgPos: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    polygonPoints?: string;
  };
  hasIndoorMap: boolean;
  description: string;
  operatingStatus: string;
  availableFacilities: string[];
  relatedEvents?: string[];
  routeNodeId: string;
  floorCount?: number;
  entryPoint: { x: number; y: number };
  // 3D Architectural Spatial Data
  pos3d?: [number, number, number];
  dim3d?: [number, number, number];
  rotationY?: number;
  geometryType?:
    | 'academic-block'
    | 'admin-block'
    | 'library'
    | 'auditorium'
    | 'seminar-hall'
    | 'cafeteria'
    | 'sports-complex'
    | 'hostel'
    | 'sac'
    | 'medical'
    | 'gate'
    | 'sports-field'
    | 'parking';
  selectedColor?: string;
  labelOffset?: [number, number, number];
  entrance3d?: [number, number, number];
}

export interface CampusEventItem {
  id: string;
  markerNumber: number; // 1, 2, 3
  title: string;
  venue: string;
  landmarkId: string;
  floorId?: string;
  roomCode?: string;
  time: string;
  date: string;
  organizer: string;
  description: string;
  actionText: string;
}

export interface BuildingMeta {
  code: string;
  name: string;
  levelsCount: number;
  totalSpaces: string;
  status: string;
  hours: string;
  coordinates: string;
}

export interface RoomSession {
  code: string;
  title: string;
  timeRange: string;
  facultyName: string;
  status?: 'COMPLETED' | 'NOW' | 'NEXT' | 'UPCOMING';
}

export interface Room {
  code: string;
  name: string;
  type: 'lecture' | 'science' | 'admin' | 'library' | 'service' | 'seminar';
  floorId: string;
  capacity: number;
  directions: string;
  nextSession?: RoomSession;
  faculty?: string;
  slabCoord: {
    u: number;
    v: number;
    width: number;
    depth: number;
  };
}

export interface Floor {
  id: string; // '05', '04', '03', '02', '01', '00'
  number: string;
  functionLabel: string;
  elevation: number; // 0 to 5
  facilities: string[];
  rooms: Room[];
}

export interface TransitStation {
  id: string;
  time: string;
  subject: string;
  roomCode: string;
  buildingName?: string;
  floorId: string;
  status: 'COMPLETED' | 'NOW' | 'NEXT' | 'UPCOMING';
  faculty: string;
  timeRange: string;
}

export interface WayfindingEvent {
  id: string;
  markerNumber?: number;
  title: string;
  location: string;
  roomCode: string;
  floorId: string;
  time: string;
  organizer: string;
  description: string;
}

export interface StudentProfile {
  name: string;
  idNumber: string;
  department: string;
  semester: string;
  avatarText: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  code?: string;
  subtitle: string;
  pathDisplay: string;
  type: 'building' | 'floor' | 'room' | 'event' | 'faculty';
  landmarkId: string;
  floorId?: string;
  roomCode?: string;
}
