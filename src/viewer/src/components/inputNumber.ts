import { createMultiNumberInput } from "./helpers";

export type Vector2 = [number, number];
export const createVector2 = (onChange?: (newValue: Vector2) => void) =>
  createMultiNumberInput<Vector2>([0, 0], onChange, 1, 2);

export type Vector3 = [number, number, number];
export const createVector3 = (onChange?: (newValue: Vector3) => void) =>
  createMultiNumberInput<Vector3>([0, 0, 0], onChange, 1, 3);

export type Vector4 = [number, number, number, number];
export const createVector4 = (onChange?: (newValue: Vector4) => void) =>
  createMultiNumberInput<Vector4>([0, 0, 0, 0], onChange, 1, 4);
