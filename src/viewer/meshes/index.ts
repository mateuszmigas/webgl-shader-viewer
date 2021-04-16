import { generatePlane } from "./plane";
import { generateCube } from "./cube";
import { MeshInfo } from "./meshInfo";
import { generateSphere } from "./sphere";
export { MeshInfo } from "./meshInfo";

export const meshes = {
  cube: generateCube(),
  sphere: generateSphere(),
  plane: generatePlane(),
};

export type MeshId = keyof typeof meshes;

export const getSerializedProp = (propName: keyof MeshInfo) =>
  new Map(Object.entries(meshes).map(([key, value]) => [key, JSON.stringify(value[propName])]));
