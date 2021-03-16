import { Matrix4Array } from "./../../types";
import React from "react";
import {
  CameraPosition,
  CameraPositionManipulator,
  cameraPositionToVector3,
} from "../../utils/cameraManipulator";
import { mat4 } from "../../utils/math";

export const usePerspectiveCamera = (
  element: HTMLElement,
  size: { width: number; height: number },
  onChange: (newPostition: Matrix4Array) => void
) => {
  React.useEffect(() => {
    if (!element) return;

    let cameraPosition: CameraPosition = { longitude: 1, latitude: 1, radius: 2 };
    new CameraPositionManipulator(
      element,
      () => cameraPosition,
      newPosition => {
        cameraPosition = newPosition;
        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const { width, height } = size;
        const aspect = width / height;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        const modelViewMatrix = mat4.create();
        const vec = cameraPositionToVector3(cameraPosition);
        mat4.lookAt(modelViewMatrix, [vec.x, vec.y, vec.z], [0, 0, 0], [0, 1, 0]);
        const res = mat4.create();
        mat4.multiply(res, projectionMatrix, modelViewMatrix);
        onChange(Array.from(res) as Matrix4Array);
      }
    );
  }, [element]);
};