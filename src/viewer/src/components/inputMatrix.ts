import { Matrix3Array, Matrix4Array } from "../types";
import { createMultiNumberInput } from "./helpers";

export const createMatrix = <T extends number[]>(
  size: number,
  onChange?: (newValue: T) => void
) => createMultiNumberInput<T>(onChange, size, size);

// export const createMatrix3 = (onChange?: (newValue: Matrix3Array) => void) =>
//   createMultiNumberInput<Matrix3Array>(onChange, 3, 3);

// export const createMatrix4 = (onChange?: (newValue: Matrix4Array) => void) =>
//   createMultiNumberInput<Matrix4Array>(onChange, 4, 4);
