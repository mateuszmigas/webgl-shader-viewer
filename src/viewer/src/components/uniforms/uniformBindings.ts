import { CameraPosition, cameraPositionToVector3 } from "./../../utils/cameraManipulator";
import { UniformType } from "../../utils/webgl/uniform";
import { Matrix4Array } from "../../types";
import { mat4 } from "../../utils/math";

const getCameraMatrix = (
  cameraPosition: CameraPosition,
  size: { width: number; height: number }
): Matrix4Array => {
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
  return Array.from(res) as Matrix4Array;
};

export const uniformBindings = new Map<
  string,
  { display: string; type: UniformType; getValue: (...arg: any[]) => any }
>([
  [
    "perspectiveCamera",
    {
      type: UniformType.FLOAT_MAT4,
      display: "Binding - Perspective Camera",
      getValue: (cameraPosition, size) => getCameraMatrix(cameraPosition, size),
    },
  ],
]);

export const getBindingOptions = (type: UniformType) =>
  Array.from(uniformBindings.entries())
    .filter(([_, value]) => value.type === type)
    .map(([key, value]) => ({
      id: key,
      display: value.display,
    }));
