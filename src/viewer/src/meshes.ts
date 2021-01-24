import { Vector4 } from "./components/inputNumber";
import { Observable } from "./utils/observable";
import { AttributeBufferType } from "./utils/webgl/attributeBuffer";

type MeshInfo = {
  display: string;
  positions: Vector4[];
  normals: Vector4[];
};

export const meshes = new Map<string, MeshInfo>([
  [
    "cube",
    {
      display: "Cube",
      positions: [[1, 2, 3, 4]],
      normals: [[5, 6, 7, 8]],
    },
  ],
  [
    "sphere",
    {
      display: "Sphere",
      positions: [[9, 10, 11, 12]],
      normals: [[13, 14, 15, 16]],
    },
  ],
]);

export const createMeshBindings = () =>
  new Map([
    [
      "positions",
      {
        name: "Binding - Mesh positions",
        type: AttributeBufferType.FLOAT_VEC4,
        value: new Observable([]),
      },
    ],
    [
      "normals",
      {
        name: "Binding - Mesh normals",
        type: AttributeBufferType.FLOAT_VEC4,
        value: new Observable([]),
      },
    ],
  ]);
