import { translations } from "@common/translations";
import { MeshInfo } from "@meshes";
import { repeat4Times } from "@utils/array";

export const generatePlane = (): MeshInfo => ({
  display: translations.meshes.plane,
  positions: [
    [-0.5, -0.5, 0, 1],
    [0.5, -0.5, 0, 1],
    [0.5, 0.5, 0, 1],
    [-0.5, 0.5, 0, 1],
  ],
  colors: repeat4Times([1.0, 1.0, 1.0, 1.0]),
  normals: [], //todo
  textureCoordinates: [
    [0.0, 0.0],
    [1.0, 0.0],
    [1.0, 1.0],
    [0.0, 1.0],
  ],
  indices: [0, 1, 2, 0, 2, 3],
});
