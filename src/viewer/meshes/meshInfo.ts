import { Vector2Array, Vector3Array, Vector4Array } from "@utils/types";

export type MeshInfo = {
  display: string;
  positions: Vector4Array[];
  colors: Vector4Array[];
  normals: Vector3Array[];
  textureCoordinates: Vector2Array[];
  indices: number[];
};
