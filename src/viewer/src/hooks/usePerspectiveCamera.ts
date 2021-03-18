import React from "react";
import { CameraPosition, CameraPositionManipulator } from "../utils/cameraManipulator";

export const usePerspectiveCamera = (
  element: HTMLElement,
  initialCameraPosition: CameraPosition,
  setCameraPosition: (newCameraPosition: CameraPosition) => void
) => {
  React.useEffect(() => {
    if (!element) return;
    let cameraPosition = { ...initialCameraPosition };
    const cameraManipulator = new CameraPositionManipulator(
      element,
      () => cameraPosition,
      newPosition => {
        cameraPosition = newPosition;
        setCameraPosition(newPosition);
      }
    );
    return () => cameraManipulator.dispose();
  }, [element]);
};
