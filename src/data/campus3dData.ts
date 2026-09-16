import { CampusLandmark } from '../types';
import { CAMPUS_LANDMARKS } from './campusMasterData';

/**
 * 3D ARCHITECTURAL MAQUETTE DATA MODEL
 * Driven entirely by data-model configuration.
 * World coordinates:
 * X: West (-60) to East (+60)
 * Z: North (-40) to South (+40)
 * Y: Height upwards (0 = ground plane)
 */

export interface CampusLandmark3D extends CampusLandmark {
  pos3d: [number, number, number];
  dim3d: [number, number, number]; // [width, height, depth]
  rotationY?: number;
  geometryType:
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
  labelOffset: [number, number, number];
  entrance3d: [number, number, number];
}

export const CAMPUS_LANDMARKS_3D: CampusLandmark3D[] = [
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'AB-01')!,
    pos3d: [4, 0, -10],
    dim3d: [22, 8.4, 16],
    rotationY: 0,
    geometryType: 'academic-block',
    labelOffset: [0, 9.6, 0],
    entrance3d: [4, 0, -1.8],
    floorCount: 6,
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'ME-01')!,
    pos3d: [-42, 0, 26],
    dim3d: [16, 3.2, 8],
    rotationY: 0,
    geometryType: 'gate',
    labelOffset: [0, 4.2, 0],
    entrance3d: [-40, 0, 26],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'AD-01')!,
    pos3d: [-22, 0, -18],
    dim3d: [18, 4.8, 12],
    rotationY: 0,
    geometryType: 'admin-block',
    labelOffset: [0, 5.8, 0],
    entrance3d: [-22, 0, -11.5],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'AU-01')!,
    pos3d: [-21, 0, 4],
    dim3d: [17, 5.6, 14],
    rotationY: 0,
    geometryType: 'auditorium',
    labelOffset: [0, 6.6, 0],
    entrance3d: [-21, 0, 11.5],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'LB-01')!,
    pos3d: [29, 0, -12],
    dim3d: [17, 4.4, 13],
    rotationY: 0,
    geometryType: 'library',
    labelOffset: [0, 5.4, 0],
    entrance3d: [20.2, 0, -12],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'CF-01')!,
    pos3d: [1, 0, 13],
    dim3d: [16, 2.8, 11],
    rotationY: 0,
    geometryType: 'cafeteria',
    labelOffset: [0, 3.8, 0],
    entrance3d: [1, 0, 7.2],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'SC-01')!,
    pos3d: [37, 0, 10],
    dim3d: [18, 4.8, 13],
    rotationY: 0,
    geometryType: 'sports-complex',
    labelOffset: [0, 5.8, 0],
    entrance3d: [27.5, 0, 10],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'OG-01')!,
    pos3d: [36, 0, 28],
    dim3d: [27, 0.4, 17],
    rotationY: 0,
    geometryType: 'sports-field',
    labelOffset: [0, 1.4, 0],
    entrance3d: [22.2, 0, 24],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'SA-01')!,
    pos3d: [18, 0, 9],
    dim3d: [13, 3.4, 10],
    rotationY: 0,
    geometryType: 'sac',
    labelOffset: [0, 4.4, 0],
    entrance3d: [11.2, 0, 9],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'BH-01')!,
    pos3d: [-42, 0, -26],
    dim3d: [15, 7.2, 13],
    rotationY: 0,
    geometryType: 'hostel',
    labelOffset: [0, 8.2, 0],
    entrance3d: [-34.2, 0, -20],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'GH-01')!,
    pos3d: [46, 0, -28],
    dim3d: [15, 7.2, 14],
    rotationY: 0,
    geometryType: 'hostel',
    labelOffset: [0, 8.2, 0],
    entrance3d: [38.2, 0, -25],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'PK-01')!,
    pos3d: [-43, 0, 8],
    dim3d: [14, 2.2, 11],
    rotationY: 0,
    geometryType: 'parking',
    labelOffset: [0, 3.2, 0],
    entrance3d: [-35.8, 0, 8],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'MR-01')!,
    pos3d: [0, 0, -28],
    dim3d: [13, 2.4, 9],
    rotationY: 0,
    geometryType: 'medical',
    labelOffset: [0, 3.4, 0],
    entrance3d: [0, 0, -23.2],
  },
  {
    ...CAMPUS_LANDMARKS.find((l) => l.id === 'SH-01')!,
    pos3d: [18, 0, -28],
    dim3d: [14, 3.6, 10],
    rotationY: 0,
    geometryType: 'seminar-hall',
    labelOffset: [0, 4.6, 0],
    entrance3d: [18, 0, -22.8],
  },
];

/**
 * 3D Landscaped Zones (Courtyards, Quads, Athletic turf)
 */
export interface CampusZone3D {
  id: string;
  name: string;
  type: 'lawn' | 'quad' | 'sports-pitch';
  center: [number, number, number];
  size: [number, number]; // [width, depth]
}

export const CAMPUS_ZONES_3D: CampusZone3D[] = [
  // Central Paved Quad Concourse
  {
    id: 'zone-central-quad',
    name: 'CENTRAL PROMENADE QUAD',
    type: 'quad',
    center: [5, 0.02, 2],
    size: [28, 14],
  },
  // North Botanical Lawn
  {
    id: 'zone-botanical-lawn',
    name: 'NORTH MEMORIAL GARDENS',
    type: 'lawn',
    center: [-22, 0.02, -30],
    size: [20, 10],
  },
  // East Academic Green Lawn
  {
    id: 'zone-academic-lawn',
    name: 'LIBRARY COMMONS LAWN',
    type: 'lawn',
    center: [28, 0.02, 0],
    size: [14, 9],
  },
  // South Concourse Lawn
  {
    id: 'zone-south-lawn',
    name: 'WEST BOULEVARD GREEN',
    type: 'lawn',
    center: [-22, 0.02, 19],
    size: [14, 12],
  },
];

/**
 * Pedestrian Promenade and Road Network (in 3D world space)
 */
export interface PathSegment3D {
  id: string;
  points: [number, number, number][];
  width: number;
}

export const PEDESTRIAN_PATHS_3D: PathSegment3D[] = [
  // Main East-West Highway / Boulevard
  {
    id: 'road-south-boulevard',
    points: [
      [-55, 0.015, 33],
      [55, 0.015, 33],
    ],
    width: 3.2,
  },
  // Primary Promenade from Main Entrance to Central Quad
  {
    id: 'path-main-entry-quad',
    points: [
      [-40, 0.03, 26],
      [-32, 0.03, 21],
      [-32, 0.03, 9],
      [-10, 0.03, 4],
      [4, 0.03, 2],
      [4, 0.03, -1.8],
    ],
    width: 2.2,
  },
  // Connection to Admin Block and Kalam Hall
  {
    id: 'path-quad-to-admin',
    points: [
      [-10, 0.03, 4],
      [-10, 0.03, -11],
      [-22, 0.03, -11.5],
    ],
    width: 1.6,
  },
  {
    id: 'path-admin-to-north',
    points: [
      [-10, 0.03, -11],
      [-10, 0.03, -22],
      [0, 0.03, -23.2],
      [18, 0.03, -22.8],
    ],
    width: 1.5,
  },
  // Connection to Library & Sports Complex
  {
    id: 'path-quad-to-library',
    points: [
      [4, 0.03, 2],
      [20, 0.03, 2],
      [20, 0.03, -12],
    ],
    width: 1.8,
  },
  {
    id: 'path-library-to-sports',
    points: [
      [20, 0.03, 2],
      [27, 0.03, 10],
    ],
    width: 1.6,
  },
  // Connection to Cafeteria
  {
    id: 'path-quad-to-cafeteria',
    points: [
      [4, 0.03, 2],
      [1, 0.03, 7.2],
    ],
    width: 1.8,
  },
  // Connection to Outdoor Ground
  {
    id: 'path-sports-to-outdoor-ground',
    points: [
      [20, 0.03, 2],
      [22, 0.03, 24],
    ],
    width: 1.8,
  },
  // Connection to Auditorium
  {
    id: 'path-concourse-to-auditorium',
    points: [
      [-32, 0.03, 9],
      [-21, 0.03, 11.5],
    ],
    width: 1.6,
  },
];

/**
 * Suggested Active Route (from User Start at Main Entrance to Academic Block Entrance)
 */
export const SUGGESTED_ROUTE_3D: [number, number, number][] = [
  [-40, 0.08, 26], // User location / Main Gate
  [-32, 0.08, 21], // Boulevard turn
  [-32, 0.08, 9], // West Concourse turn
  [-10, 0.08, 4], // Central Quad Junction
  [4, 0.08, 2], // Academic Block Forecourt
  [4, 0.08, -1.8], // Academic Block Entrance Portico
];

/**
 * Minimal abstract architectural trees (low-poly cones on trunks)
 */
export interface CampusTree3D {
  position: [number, number, number];
  height: number;
  radius: number;
}

export const CAMPUS_TREES_3D: CampusTree3D[] = [
  // Along South Boulevard
  { position: [-48, 0, 31], height: 2.8, radius: 0.9 },
  { position: [-38, 0, 31], height: 3.1, radius: 1.0 },
  { position: [-26, 0, 31], height: 2.7, radius: 0.85 },
  { position: [-14, 0, 31], height: 3.0, radius: 0.95 },
  { position: [-2, 0, 31], height: 2.9, radius: 0.9 },
  { position: [10, 0, 31], height: 3.2, radius: 1.0 },
  { position: [20, 0, 31], height: 2.8, radius: 0.9 },

  // Botanical Garden cluster
  { position: [-26, 0, -32], height: 3.5, radius: 1.1 },
  { position: [-20, 0, -33], height: 3.0, radius: 1.0 },
  { position: [-16, 0, -29], height: 3.2, radius: 1.05 },
  { position: [-24, 0, -27], height: 2.6, radius: 0.85 },

  // Central Quad perimeter
  { position: [-8, 0, 1], height: 2.8, radius: 0.9 },
  { position: [-8, 0, -3], height: 3.0, radius: 0.95 },
  { position: [16, 0, 1], height: 2.9, radius: 0.9 },
  { position: [16, 0, -3], height: 3.1, radius: 1.0 },

  // Library lawn
  { position: [24, 0, -2], height: 2.7, radius: 0.85 },
  { position: [32, 0, -2], height: 3.0, radius: 0.95 },
];

/**
 * Academic Block 6-Floor Stack Metadata
 * Detailed 3D floor slabs and room partitions.
 */
export interface AcademicFloorPlate3D {
  id: string;
  floorNumber: string;
  elevationIndex: number; // 0 to 5
  functionLabel: string;
  subtitle: string;
  thickness: number;
  width: number;
  depth: number;
  isNextClassFloor?: boolean;
}

export const ACADEMIC_FLOOR_PLATES_3D: AcademicFloorPlate3D[] = [
  {
    id: '00',
    floorNumber: '00',
    elevationIndex: 0,
    functionLabel: 'GROUND',
    subtitle: 'ENTRY CONCOURSE · ADMISSIONS · MAIN ATRIUM',
    thickness: 0.6,
    width: 22,
    depth: 16,
  },
  {
    id: '01',
    floorNumber: '01',
    elevationIndex: 1,
    functionLabel: 'VENDHAR KNOWLEDGE CENTRE',
    subtitle: 'DIGITAL COMMONS · STUDY PODS · REFERENCE REPOSITORY',
    thickness: 0.6,
    width: 22,
    depth: 16,
  },
  {
    id: '02',
    floorNumber: '02',
    elevationIndex: 2,
    functionLabel: 'LECTURE',
    subtitle: 'TIERED HALLS 201 – 218 · UNDERGRADUATE WING',
    thickness: 0.6,
    width: 22,
    depth: 16,
  },
  {
    id: '03',
    floorNumber: '03',
    elevationIndex: 3,
    functionLabel: 'LECTURE',
    subtitle: 'TIERED HALLS 301 – 320 · TUTORIAL SUITES',
    thickness: 0.6,
    width: 22,
    depth: 16,
  },
  {
    id: '04',
    floorNumber: '04',
    elevationIndex: 4,
    functionLabel: 'LECTURE + SCIENCE',
    subtitle: 'COMPUTING CLUSTER · LH 406 (NEXT CLASS) · SEM 404',
    thickness: 0.6,
    width: 22,
    depth: 16,
    isNextClassFloor: true,
  },
  {
    id: '05',
    floorNumber: '05',
    elevationIndex: 5,
    functionLabel: 'ADMINISTRATION',
    subtitle: "DEAN'S OFFICE · FACULTY OFFICES · BOARD ROOM",
    thickness: 0.6,
    width: 22,
    depth: 16,
  },
];

/**
 * Level 04 3D Room Layout (for isolated floor / room view)
 */
export interface Room3D {
  code: string;
  name: string;
  type: 'lecture' | 'science' | 'seminar' | 'admin' | 'corridor' | 'lift';
  // Position relative to floor center [x, z, width, depth]
  localX: number;
  localZ: number;
  width: number;
  depth: number;
  isDestination?: boolean;
  hasEvent?: boolean;
}

export const LEVEL_04_ROOMS_3D: Room3D[] = [
  // West Lecture Wing
  {
    code: 'LH 401',
    name: 'Lecture Hall 401',
    type: 'lecture',
    localX: -7.5,
    localZ: -4.5,
    width: 5.5,
    depth: 5.0,
  },
  {
    code: 'LH 402',
    name: 'Lecture Hall 402',
    type: 'lecture',
    localX: -7.5,
    localZ: 4.5,
    width: 5.5,
    depth: 5.0,
  },
  // East Lecture Wing (includes NEXT CLASS LH 406)
  {
    code: 'LH 405',
    name: 'Lecture Hall 405',
    type: 'lecture',
    localX: 7.5,
    localZ: -4.5,
    width: 5.5,
    depth: 5.0,
  },
  {
    code: 'LH 406',
    name: 'Lecture Hall 406 (Next Class)',
    type: 'lecture',
    localX: 7.5,
    localZ: 4.5,
    width: 5.5,
    depth: 5.0,
    isDestination: true,
  },
  // North Science & Seminar Labs
  {
    code: 'SEM 404',
    name: 'Seminar Room 404',
    type: 'seminar',
    localX: 0,
    localZ: -5.5,
    width: 6.5,
    depth: 4.0,
    hasEvent: true,
  },
  {
    code: 'LAB 403',
    name: 'Distributed Systems Lab',
    type: 'science',
    localX: 0,
    localZ: 5.5,
    width: 6.5,
    depth: 4.0,
  },
  // Central Lift Quad Core
  {
    code: 'LIFT',
    name: 'Central Lift Core',
    type: 'lift',
    localX: 0,
    localZ: 0,
    width: 3.5,
    depth: 3.5,
  },
];

/**
 * Level 04 Indoor Route (from Central Lift Core to LH 406)
 */
export const LEVEL_04_INDOOR_ROUTE_3D: [number, number, number][] = [
  [0, 0.05, 0], // Lift Core exit
  [0, 0.05, 2.5], // Corridor spine
  [4.5, 0.05, 2.5], // East wing hallway
  [6.8, 0.05, 2.5], // LH 406 doorway
  [7.5, 0.05, 4.0], // Inside LH 406
];
