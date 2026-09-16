import React from 'react';
import {
  CampusLandmark,
  CampusCategory,
  CampusEventItem,
} from '../types';
import { CampusCanvas3D } from './campus3d/CampusCanvas3D';

export interface CampusMasterMapProps {
  selectedLandmark: CampusLandmark | null;
  onSelectLandmark: (landmark: CampusLandmark) => void;
  selectedCategory: CampusCategory;
  onSelectCategory: (category: CampusCategory) => void;
  onEnterAcademicBlock: () => void;
  selectedEventId: string | null;
  onSelectEvent: (event: CampusEventItem) => void;
  isRoutingToAcademicBlock: boolean;
}

export const CampusMasterMap: React.FC<CampusMasterMapProps> = ({
  selectedLandmark,
  onSelectLandmark,
  selectedCategory,
  onEnterAcademicBlock,
  selectedEventId,
  onSelectEvent,
}) => {
  return (
    <div className="w-full h-full relative">
      <CampusCanvas3D
        spatialViewLevel="CAMPUS"
        selectedLandmarkId={selectedLandmark?.id || null}
        selectedEventId={selectedEventId}
        selectedFloorId="04"
        selectedRoomCode="LH 406"
        isFloorIsolated={false}
        isRoutingIndoor={false}
        activeCategory={selectedCategory}
        onSelectLandmark={onSelectLandmark}
        onSelectEvent={onSelectEvent}
        onSelectFloor={() => {}}
        onSelectRoom={() => {}}
        onEnterBuilding={onEnterAcademicBlock}
        onReturnToCampus={() => {}}
      />
    </div>
  );
};
