import { generatePlane } from "./plane";
import { generateCube } from "./cube";
import { MeshInfo } from "./meshInfo";
import { generateSphere } from "./sphere";
export { MeshInfo } from "./meshInfo";

export const meshes = new Map<string, MeshInfo>([
  ["cube", generateCube()],
  ["sphere", generateSphere()],
  ["plane", generatePlane()],
]);

export const getSerializedProp = (propName: keyof MeshInfo) =>
  new Map(
    Array.from(meshes.entries()).map(([key, value]) => [key, JSON.stringify(value[propName])])
  );
