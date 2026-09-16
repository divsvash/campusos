import React from 'react';
import { Html } from '@react-three/drei';
import { CampusLandmark3D } from '../../data/campus3dData';

interface BuildingLabels3DProps {
  landmarks: CampusLandmark3D[];
  selectedId: string | null;
  hoveredId: string | null;
  isBuildingViewActive: boolean;
  onSelect: (landmark: CampusLandmark3D) => void;
}

export const BuildingLabels3D: React.FC<BuildingLabels3DProps> = ({
  landmarks,
  selectedId,
  hoveredId,
  isBuildingViewActive,
}) => {
  if (isBuildingViewActive) return null;

  return (
    <group>
      {landmarks.map((landmark) => {
        // Skip Academic Block label as it has its own prominent NEXT CLASS banner
        if (landmark.id === 'AB-01') return null;

        const isSelected = selectedId === landmark.id;
        const isHovered = hoveredId === landmark.id;

        // Position label above building
        const labelPos: [number, number, number] = [
          landmark.pos3d[0] + landmark.labelOffset[0],
          landmark.pos3d[1] + landmark.labelOffset[1],
          landmark.pos3d[2] + landmark.labelOffset[2],
        ];

        return (
          <Html
            key={`label-${landmark.id}`}
            position={labelPos}
            center
            className="select-none pointer-events-none"
          >
            <div
              className={`px-2 py-0.5 border text-center transition-all duration-150 shadow-sm whitespace-nowrap ${
                isSelected
                  ? 'bg-[#153E90] text-[#FFFFFF] border-[#121212] font-bold ring-2 ring-[#153E90]'
                  : isHovered
                  ? 'bg-[#121212] text-[#FFFFFF] border-[#121212]'
                  : 'bg-[#FFFFFF]/95 text-[#121212] border-[#C9C6BC]'
              }`}
            >
              <div className="font-mono text-[9px] font-bold tracking-tight">
                {landmark.code}
              </div>
              <div className="text-[10px] font-sans font-semibold tracking-tight uppercase">
                {landmark.shortLabel}
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
};
