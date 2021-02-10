import { Matrix3Array, Matrix4Array } from "../types";
import { createMultiNumberInput } from "./helpers";

export const createMatrix3 = (onChange?: (newValue: Matrix3Array) => void) =>
  createMultiNumberInput<Matrix3Array>(
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    onChange,
    3,
    3
  );

export const createMatrix4 = (onChange?: (newValue: Matrix4Array) => void) =>
  createMultiNumberInput<Matrix4Array>(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    onChange,
    4,
    4
  );
