import { CampusLandmark, CampusEventItem } from '../types';

/**
 * CONFIGURABLE CAMPUS MASTER DATA
 * Architectural Site Plan Grid coordinates (viewBox 0 0 1000 700)
 * All coordinates are data-driven and can be easily adjusted or replaced.
 */

export const STUDENT_START_LOCATION = {
  label: 'YOU (MAIN ENTRANCE)',
  landmarkId: 'ME-01',
  x: 140,
  y: 560,
};

export const CAMPUS_EVENTS_DATA: CampusEventItem[] = [
  {
    id: 'ev-01',
    markerNumber: 1,
    title: 'Cloud Community Meetup',
    venue: 'Academic Block / Level 04 / Seminar Panel 04',
    landmarkId: 'AB-01',
    floorId: '04',
    roomCode: 'SEM 404',
    time: '16:00 TODAY',
    date: '15 SEP 2026',
    organizer: 'SRM ACM CHAPTER',
    description: 'Kubernetes orchestration, distributed edge architectures & serverless roundtable with cloud leads.',
    actionText: 'REGISTER SESSION',
  },
  {
    id: 'ev-02',
    markerNumber: 2,
    title: 'Cultural Society Auditions',
    venue: 'Auditorium / Grand Stage',
    landmarkId: 'AU-01',
    time: '15:30 TODAY',
    date: '15 SEP 2026',
    organizer: 'MILAN CULTURAL BOARD',
    description: 'Annual performing arts, classical instrumentation, and theatrical ensemble selection trials.',
    actionText: 'AUDITION SLOTS',
  },
  {
    id: 'ev-03',
    markerNumber: 3,
    title: 'Five-a-Side Tournament',
    venue: 'Outdoor Ground / North Pitch',
    landmarkId: 'OG-01',
    time: '17:00 TODAY',
    date: '15 SEP 2026',
    organizer: 'SRM INTRAMURAL ATHLETICS',
    description: 'Inter-departmental league quarterfinals under floodlights. Student referee registration active.',
    actionText: 'FIXTURE TABLE',
  },
];

export const CAMPUS_LANDMARKS: CampusLandmark[] = [
  {
    id: 'AB-01',
    code: 'AB-01',
    name: 'Academic Block',
    shortLabel: 'ACADEMIC BLOCK',
    category: 'ACADEMIC',
    svgPos: { x: 440, y: 200, width: 180, height: 130 },
    hasIndoorMap: true,
    floorCount: 6,
    description: 'Six-level primary lecture complex, advanced scientific laboratories, and faculty departments.',
    operatingStatus: 'OPEN · 07:00 – 21:30',
    availableFacilities: [
      '120+ Teaching Halls',
      'Data Science Cluster',
      'Central Lift Quad',
      'Vendhar Library Commons',
      'Seminar Suites',
    ],
    relatedEvents: ['ev-01'],
    routeNodeId: 'node-ab',
    entryPoint: { x: 530, y: 330 },
  },
  {
    id: 'ME-01',
    code: 'ME-01',
    name: 'Main Entrance & Gate Plaza',
    shortLabel: 'MAIN ENTRANCE',
    category: 'SERVICES',
    svgPos: { x: 60, y: 530, width: 140, height: 70 },
    hasIndoorMap: false,
    description: 'Primary campus boulevard gateway, automated biometric entry turnstiles, and security outpost.',
    operatingStatus: '24/7 PATROLLED',
    availableFacilities: ['Security Command', 'Visitor Registry', 'Bicycle Docking', 'E-Transit Shuttle Stop'],
    routeNodeId: 'node-me',
    entryPoint: { x: 130, y: 565 },
  },
  {
    id: 'AD-01',
    code: 'AD-01',
    name: 'Administrative Block',
    shortLabel: 'ADMINISTRATIVE BLOCK',
    category: 'SERVICES',
    svgPos: { x: 230, y: 150, width: 150, height: 100 },
    hasIndoorMap: false,
    description: "Office of the Vice Chancellor, Registrar's chambers, admissions cell, and university finance bureau.",
    operatingStatus: 'OPEN · 08:30 – 17:30',
    availableFacilities: ['Admissions Cell', 'Finance Office', 'Chancellor Suite', 'Certificate Attestation'],
    routeNodeId: 'node-ad',
    entryPoint: { x: 305, y: 250 },
  },
  {
    id: 'AU-01',
    code: 'AU-01',
    name: 'University Auditorium',
    shortLabel: 'AUDITORIUM',
    category: 'EVENTS',
    svgPos: { x: 250, y: 320, width: 140, height: 120 },
    hasIndoorMap: false,
    description: 'Acoustically tuned 2,800-seat multi-tier amphitheatre hosting convocations, symposiums, and cultural fests.',
    operatingStatus: 'OPEN FOR EVENTS · 09:00 – 22:00',
    availableFacilities: ['2800 Seats', 'Green Rooms', 'Audio Recording Deck', 'Orchestra Pit'],
    relatedEvents: ['ev-02'],
    routeNodeId: 'node-au',
    entryPoint: { x: 320, y: 440 },
  },
  {
    id: 'LB-01',
    code: 'LB-01',
    name: 'Central University Library',
    shortLabel: 'LIBRARY',
    category: 'ACADEMIC',
    svgPos: { x: 680, y: 190, width: 140, height: 110 },
    hasIndoorMap: false,
    description: 'Four-level research depository housing 250,000 physical volumes, quiet carrels, and IEEE database access.',
    operatingStatus: 'OPEN · 08:00 – 23:00',
    availableFacilities: ['Silent Carrels', 'Microfilm Depository', 'Digital Research Commons', 'Book Borrowing Kiosk'],
    routeNodeId: 'node-lb',
    entryPoint: { x: 680, y: 245 },
  },
  {
    id: 'CF-01',
    code: 'CF-01',
    name: 'Central Food Court & Bistro',
    shortLabel: 'CAFETERIA',
    category: 'FOOD',
    svgPos: { x: 440, y: 410, width: 130, height: 90 },
    hasIndoorMap: false,
    description: 'Multi-cuisine student mess, international food retail outlets, barista bar, and open-air garden terrace.',
    operatingStatus: 'OPEN · 07:00 – 22:30',
    availableFacilities: ['Multi-Cuisine Mess', 'Espresso Bar', 'Bakery Counter', 'Digital Meal Ordering'],
    routeNodeId: 'node-cf',
    entryPoint: { x: 505, y: 410 },
  },
  {
    id: 'SC-01',
    code: 'SC-01',
    name: 'Indoor Sports Complex',
    shortLabel: 'SPORTS COMPLEX',
    category: 'SPORTS',
    svgPos: { x: 740, y: 380, width: 150, height: 110 },
    hasIndoorMap: false,
    description: 'Olympic-standard hardwood basketball arena, 8 badminton courts, Olympic swimming tank, and fitness gym.',
    operatingStatus: 'OPEN · 06:00 – 21:00',
    availableFacilities: ['Basketball Arena', 'Swimming Pool', 'Cardio Suite', 'Badminton Courts'],
    routeNodeId: 'node-sc',
    entryPoint: { x: 740, y: 435 },
  },
  {
    id: 'OG-01',
    code: 'OG-01',
    name: 'University Athletic Grounds',
    shortLabel: 'OUTDOOR GROUND',
    category: 'SPORTS',
    svgPos: { x: 700, y: 520, width: 220, height: 140 },
    hasIndoorMap: false,
    description: 'Natural turf soccer arena, cricket pitch, 400m synthetic running track, and floodlit team dugouts.',
    operatingStatus: 'OPEN · 05:30 – 20:30',
    availableFacilities: ['400m Track', 'Cricket Pavilion', 'Soccer Pitch', 'Floodlight System'],
    relatedEvents: ['ev-03'],
    routeNodeId: 'node-og',
    entryPoint: { x: 700, y: 560 },
  },
  {
    id: 'SA-01',
    code: 'SA-01',
    name: 'Student Activity Centre (SAC)',
    shortLabel: 'STUDENT ACTIVITY CENTRE',
    category: 'EVENTS',
    svgPos: { x: 600, y: 380, width: 110, height: 90 },
    hasIndoorMap: false,
    description: 'Headquarters for student clubs, robotics test arena, darkroom, and creative societies workspace.',
    operatingStatus: 'OPEN · 08:00 – 22:00',
    availableFacilities: ['Club Headquarters', 'Robotics Testing Bed', 'Society Meeting Rooms', 'Media Studio'],
    routeNodeId: 'node-sa',
    entryPoint: { x: 600, y: 425 },
  },
  {
    id: 'BH-01',
    code: 'BH-01',
    name: "Boys' Residential Quad",
    shortLabel: "BOYS' HOSTEL",
    category: 'SERVICES',
    svgPos: { x: 80, y: 80, width: 120, height: 110 },
    hasIndoorMap: false,
    description: 'Multi-block undergraduate residential towers with study parlours, laundromat, and common rooms.',
    operatingStatus: 'RESIDENTIAL · ACCESS CONTROLLED',
    availableFacilities: ['Study Rooms', 'High-Speed Wi-Fi', 'Laundromat', 'Dining Annexe'],
    routeNodeId: 'node-bh',
    entryPoint: { x: 140, y: 190 },
  },
  {
    id: 'GH-01',
    code: 'GH-01',
    name: "Girls' Residential Quad",
    shortLabel: "GIRLS' HOSTEL",
    category: 'SERVICES',
    svgPos: { x: 830, y: 60, width: 120, height: 120 },
    hasIndoorMap: false,
    description: 'Dedicated residential complex featuring 24-hour warden desk, dispensary desk, and courtyard gardens.',
    operatingStatus: 'RESIDENTIAL · ACCESS CONTROLLED',
    availableFacilities: ['Courtyard Gardens', '24/7 Security', 'Fitness Corner', 'Reading Parlour'],
    routeNodeId: 'node-gh',
    entryPoint: { x: 830, y: 140 },
  },
  {
    id: 'PK-01',
    code: 'PK-01',
    name: 'West Multi-Level Parking',
    shortLabel: 'PARKING',
    category: 'SERVICES',
    svgPos: { x: 70, y: 370, width: 120, height: 90 },
    hasIndoorMap: false,
    description: 'Automated 450-vehicle parking structure with electric vehicle rapid chargers and faculty permit bays.',
    operatingStatus: 'OPEN · 24 HOURS',
    availableFacilities: ['450 Parking Bays', 'EV Fast Chargers', 'Covered Two-Wheeler Shed'],
    routeNodeId: 'node-pk',
    entryPoint: { x: 190, y: 415 },
  },
  {
    id: 'MR-01',
    code: 'MR-01',
    name: 'Campus Health Centre & Medical Room',
    shortLabel: 'MEDICAL ROOM',
    category: 'SERVICES',
    svgPos: { x: 440, y: 80, width: 110, height: 75 },
    hasIndoorMap: false,
    description: 'Immediate first response medical facility staffed with emergency medical officers and ambulance dispatch.',
    operatingStatus: '24/7 EMERGENCY READY',
    availableFacilities: ['Emergency Doctor', 'Observation Beds', 'Pharmacy Dispenser', 'Ambulance Bay'],
    routeNodeId: 'node-mr',
    entryPoint: { x: 495, y: 155 },
  },
  {
    id: 'SH-01',
    code: 'SH-01',
    name: 'Kalam Seminar Hall',
    shortLabel: 'SEMINAR HALL',
    category: 'ACADEMIC',
    svgPos: { x: 590, y: 80, width: 120, height: 80 },
    hasIndoorMap: false,
    description: 'Tiered executive amphitheatre for doctoral defenses, visiting scholar lectures, and symposiums.',
    operatingStatus: 'OPEN · 08:30 – 19:00',
    availableFacilities: ['220 Tiered Seats', 'Telepresence Rig', 'Dolby Speech Array'],
    routeNodeId: 'node-sh',
    entryPoint: { x: 650, y: 160 },
  },
];

/**
 * Pedestrian Promenade and Roadway Network
 */
export const CAMPUS_PATHS = [
  // Primary Central Spine from Main Entrance to Academic Block & Library
  'M 130 565 L 200 520 L 200 420 L 400 370 L 530 350',
  // Spine extending to Academic Block entrance
  'M 530 350 L 530 330',
  // Path from Academic Block to Library & Sports Complex
  'M 530 350 L 680 350 L 680 245',
  'M 680 350 L 740 435',
  // Path to Outdoor Ground
  'M 680 350 L 680 560 L 700 560',
  // Central Plaza Concourse Ring
  'M 400 370 L 440 370 L 505 410',
  // Path to Admin Block & Kalam Seminar Hall
  'M 400 370 L 400 250 L 305 250',
  'M 400 250 L 400 160 L 495 155',
  'M 400 160 L 650 160',
  // Path to Auditorium
  'M 200 420 L 320 440',
  // Path to Boys Hostel
  'M 200 520 L 140 300 L 140 190',
  // Path to Girls Hostel
  'M 680 245 L 830 180 L 830 140',
  // Path to SAC
  'M 530 350 L 600 425',
];

/**
 * Suggested Active Route from Main Entrance (User's location) to Academic Block
 */
export const SUGGESTED_ROUTE_COORDS = [
  { x: 140, y: 560 }, // User Pin / Main Gate
  { x: 200, y: 520 }, // South Boulevard turn
  { x: 200, y: 420 }, // West Concourse turn
  { x: 400, y: 370 }, // Central Quad Promenade Junction
  { x: 530, y: 350 }, // Academic Block Forecourt
  { x: 530, y: 330 }, // Main Academic Entrance Portico
];

/**
 * Major Landscaped Zones (Quads, Greens, Sports Grounds)
 */
export const CAMPUS_ZONES = [
  // Central Academic Quad & Promenade
  {
    id: 'zone-quad',
    name: 'CENTRAL PROMENADE QUAD',
    polygon: '380,240 640,240 640,360 380,360',
    type: 'paved-quad',
  },
  // North Memorial Botanical Gardens
  {
    id: 'zone-gardens',
    name: 'NORTH BOTANICAL GARDENS',
    polygon: '220,70 390,70 390,140 220,140',
    type: 'green',
  },
  // East Athletic Field Lawn
  {
    id: 'zone-sports-turf',
    name: 'NATURAL TURF PITCH',
    polygon: '710,530 910,530 910,650 710,650',
    type: 'sports-field',
  },
];
