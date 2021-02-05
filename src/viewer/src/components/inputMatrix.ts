import { createMultiNumberInput } from "./helpers";

export type Matrix3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
export const createMatrix3 = (onChange?: (newValue: Matrix3) => void) =>
  createMultiNumberInput<Matrix3>([0, 0, 0, 0, 0, 0, 0, 0, 0], onChange, 3, 3);

export type Matrix4 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
