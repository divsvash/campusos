import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { SpatialViewLevel } from '../../types';

interface CampusCameraControllerProps {
  spatialViewLevel: SpatialViewLevel;
  selectedLandmarkPos: [number, number, number] | null;
  isFloorIsolated: boolean;
  reducedMotion?: boolean;
  onResetTrigger?: number; // timestamp to trigger reset
  zoomLevel: number;
}

export const CampusCameraController: React.FC<CampusCameraControllerProps> = ({
  spatialViewLevel,
  selectedLandmarkPos,
  isFloorIsolated,
  reducedMotion = false,
  onResetTrigger,
  zoomLevel,
}) => {
  const { camera, gl } = useThree();

  // Current animated target & camera state
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentZoom = useRef(14.5);
  const desiredZoom = useRef(14.5);

  // User interactive pan offset (accumulated via drag)
  const panOffset = useRef(new THREE.Vector2(0, 0));
  const isDragging = useRef(false);
  const dragStart = useRef(new THREE.Vector2(0, 0));

  // User interactive rotation offset (clamped to ±25 deg)
  const azimuthOffset = useRef(0);
  const isRotating = useRef(false);

  // Default angles:
  // Base Azimuth: 45 degrees (isometric diagonal)
  // Base Pitch: ~39 degrees downward tilt
  const baseAzimuth = Math.PI / 4;
  const basePitch = Math.PI * 0.22;
  const distance = 120; // Distance along isometric vector

  // Helper to recompute desiredTarget without sudden snaps
  const updateDesiredState = useCallback(() => {
    let baseX = 0;
    let baseY = 0;
    let baseZ = 0;
    let targetZoom = 14.5;

    if (spatialViewLevel === 'CAMPUS') {
      if (selectedLandmarkPos) {
        baseX = selectedLandmarkPos[0];
        baseY = 2;
        baseZ = selectedLandmarkPos[2];
        targetZoom = 18;
      } else {
        baseX = 0;
        baseY = 0;
        baseZ = 0;
        targetZoom = 14.5;
      }
    } else if (spatialViewLevel === 'BUILDING') {
      baseX = 4;
      baseY = 9.5;
      baseZ = -10;
      targetZoom = 21;
    } else if (spatialViewLevel === 'FLOOR' || isFloorIsolated) {
      baseX = 4;
      baseY = 5.0;
      baseZ = -10;
      targetZoom = 27;
    }

    desiredTarget.current.set(
      baseX + panOffset.current.x,
      baseY,
      baseZ + panOffset.current.y
    );
    desiredZoom.current = targetZoom * (zoomLevel / 100);
  }, [spatialViewLevel, selectedLandmarkPos, isFloorIsolated, zoomLevel]);

  // Sync desired state on prop changes
  useEffect(() => {
    updateDesiredState();
  }, [updateDesiredState]);

  // Reset view handler
  useEffect(() => {
    if (onResetTrigger && onResetTrigger > 0) {
      panOffset.current.set(0, 0);
      azimuthOffset.current = 0;
      updateDesiredState();
    }
  }, [onResetTrigger, updateDesiredState]);

  // Mouse & Touch interaction for panning and limited rotation
  useEffect(() => {
    const dom = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      try {
        dom.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }

      if (e.button === 2 || e.altKey) {
        isRotating.current = true;
      } else if (e.button === 0) {
        isDragging.current = true;
      }
      dragStart.current.set(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current && !isRotating.current) return;

      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      dragStart.current.set(e.clientX, e.clientY);

      if (isRotating.current) {
        // Limit horizontal rotation to ±25 degrees (~0.43 radians)
        const maxRot = Math.PI * 0.14;
        azimuthOffset.current = THREE.MathUtils.clamp(
          azimuthOffset.current - deltaX * 0.005,
          -maxRot,
          maxRot
        );
      } else if (isDragging.current) {
        // Panning in world coordinates: scale by inverse zoom
        const panSpeed = 0.85 / (camera as THREE.OrthographicCamera).zoom;
        const cos = Math.cos(baseAzimuth + azimuthOffset.current);
        const sin = Math.sin(baseAzimuth + azimuthOffset.current);

        // Map screen drag onto isometric ground plane
        const worldDx = (-deltaX * cos - deltaY * sin) * panSpeed;
        const worldDz = (deltaX * sin - deltaY * cos) * panSpeed;

        panOffset.current.x = THREE.MathUtils.clamp(panOffset.current.x + worldDx, -45, 45);
        panOffset.current.y = THREE.MathUtils.clamp(panOffset.current.y + worldDz, -35, 35);

        updateDesiredState();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      isDragging.current = false;
      isRotating.current = false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    dom.addEventListener('pointermove', handlePointerMove);
    dom.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('pointercancel', handlePointerUp);
    dom.addEventListener('contextmenu', handleContextMenu);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('pointercancel', handlePointerUp);
      dom.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [gl, camera, baseAzimuth, updateDesiredState]);

  // Smooth frame loop updating camera position and orientation
  useFrame((_, delta) => {
    const orthoCam = camera as THREE.OrthographicCamera;
    const speed = reducedMotion ? 40 : 6.0;

    // Smoothly lerp target
    currentTarget.current.lerp(desiredTarget.current, Math.min(1, delta * speed));

    // Smoothly lerp zoom
    currentZoom.current = THREE.MathUtils.damp(
      currentZoom.current,
      desiredZoom.current,
      speed,
      delta
    );
    orthoCam.zoom = currentZoom.current;
    orthoCam.updateProjectionMatrix();

    // Compute camera position relative to target with isometric pitch and azimuth
    const effectiveAzimuth = baseAzimuth + azimuthOffset.current;
    const effectivePitch =
      spatialViewLevel === 'FLOOR' || isFloorIsolated
        ? Math.PI * 0.28
        : basePitch;

    const x = currentTarget.current.x + distance * Math.cos(effectivePitch) * Math.sin(effectiveAzimuth);
    const y = currentTarget.current.y + distance * Math.sin(effectivePitch);
    const z = currentTarget.current.z + distance * Math.cos(effectivePitch) * Math.cos(effectiveAzimuth);

    camera.position.set(x, y, z);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
