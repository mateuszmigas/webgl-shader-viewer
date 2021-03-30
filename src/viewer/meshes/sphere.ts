import { TextCoord, Vector3 } from "./../../utils/types";
import { MeshInfo } from "./meshInfo";

export const generateSphere = (): MeshInfo => {
  const vertices: Vector3[] = [];
  const normals: Vector3[] = [];
  const texCoords: TextCoord[] = [];
  const radius = 0.5;
  const sectorCount = 15;
  const stackCount = 15;
  const lengthInv = 1.0 / radius;
  const sectorStep = (2 * Math.PI) / sectorCount;
  const stackStep = Math.PI / stackCount;

  for (let i = 0; i <= stackCount; ++i) {
    const stackAngle = Math.PI / 2 - i * stackStep;
    const xy = radius * Math.cos(stackAngle);
    const z = radius * Math.sin(stackAngle);

    for (let j = 0; j <= sectorCount; ++j) {
      const sectorAngle = j * sectorStep;
      const x = xy * Math.cos(sectorAngle);
      const y = xy * Math.sin(sectorAngle);
      vertices.push({ x, y, z });
      const nx = x * lengthInv;
      const ny = y * lengthInv;
      const nz = z * lengthInv;
      normals.push({ x: nx, y: ny, z: nz });
      const s = j / sectorCount;
      const t = i / stackCount;
      texCoords.push({ u: s, v: t });
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < stackCount; ++i) {
    let k1 = i * (sectorCount + 1);
    let k2 = k1 + sectorCount + 1;

    for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
      if (i !== 0) {
        indices.push(k1);
        indices.push(k2);
        indices.push(k1 + 1);
      }

      if (i !== stackCount - 1) {
        indices.push(k1 + 1);
        indices.push(k2);
        indices.push(k2 + 1);
      }
    }
  }

  return {
    display: "Sphere",
    positions: vertices.map(v => [v.x, v.y, v.z, 1]),
    colors: [],
    normals: normals.map(v => [v.x, v.y, v.z]),
    textureCoordinates: texCoords.map(t => [t.u, t.v]),
    indices: indices,
  };
};
