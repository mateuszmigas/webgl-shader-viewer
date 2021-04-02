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
