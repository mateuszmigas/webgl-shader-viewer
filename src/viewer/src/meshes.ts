import { Vector4 } from "./components/inputNumber";
import { Observable } from "./utils/observable";
import { AttributeBufferType } from "./utils/webgl/attributeBuffer";

type MeshInfo = {
  display: string;
  positions: Vector4[];
  colors: Vector4[];
  indices: number[];
};

export const repeat4Times = <T>(array: T[]) => {
  return [].concat(array, array, array, array);
};

export const meshes = new Map<string, MeshInfo>([
  [
    "cube",
    {
      display: "Cube",
      positions: [
        // Front face
        [-0.5, -0.5, 0.5, 1],
        [0.5, -0.5, 0.5, 1],
        [0.5, 0.5, 0.5, 1],
        [-0.5, 0.5, 0.5, 1],

        // Back face
        [-0.5, -0.5, -0.5, 1],
        [-0.5, 0.5, -0.5, 1],
        [0.5, 0.5, -0.5, 1],
        [0.5, -0.5, -0.5, 1],

        // Top face
        [-0.5, 0.5, -0.5, 1],
        [-0.5, 0.5, 0.5, 1],
        [0.5, 0.5, 0.5, 1],
        [0.5, 0.5, -0.5, 1],

        // Bottom face
        [-0.5, -0.5, -0.5, 1],
        [0.5, -0.5, -0.5, 1],
        [0.5, -0.5, 0.5, 1],
        [-0.5, -0.5, 0.5, 1],

        // Right face
        [0.5, -0.5, -0.5, 1],
        [0.5, 0.5, -0.5, 1],
        [0.5, 0.5, 0.5, 1],
        [0.5, -0.5, 0.5, 1],

        // Left face
        [-0.5, -0.5, -0.5, 1],
        [-0.5, -0.5, 0.5, 1],
        [-0.5, 0.5, 0.5, 1],
        [-0.5, 0.5, -0.5, 1],
      ],
      colors: [
        ...repeat4Times([1.0, 1.0, 1.0, 1.0]), // Front face: white
        ...repeat4Times([1.0, 0.0, 0.0, 1.0]), // Back face: red
        ...repeat4Times([0.0, 1.0, 0.0, 1.0]), // Top face: green
        ...repeat4Times([0.0, 0.0, 1.0, 1.0]), // Bottom face: blue
        ...repeat4Times([1.0, 1.0, 0.0, 1.0]), // Right face: yellow
        ...repeat4Times([1.0, 0.0, 1.0, 1.0]), // Left face: purple
      ],
      indices: [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
      ],
    },
  ],
]);

console.log(meshes);

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
      "colors",
      {
        name: "Binding - Mesh colors",
        type: AttributeBufferType.FLOAT_VEC4,
        value: new Observable([]),
      },
    ],
  ]);
