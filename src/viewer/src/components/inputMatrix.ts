import { Matrix3, Matrix4 } from "../types";
import { createMultiNumberInput } from "./helpers";

export const createMatrix3 = (onChange?: (newValue: Matrix3) => void) =>
  createMultiNumberInput<Matrix3>([0, 0, 0, 0, 0, 0, 0, 0, 0], onChange, 3, 3);

export const createMatrix4 = (onChange?: (newValue: Matrix4) => void) =>
  createMultiNumberInput<Matrix4>(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    onChange,
    4,
    4
  );
