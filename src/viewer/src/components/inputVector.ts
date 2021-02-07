import { Vector2, Vector3, Vector4 } from "../types";
import { createMultiNumberInput } from "./helpers";

export const createVector2 = (onChange?: (newValue: Vector2) => void) =>
  createMultiNumberInput<Vector2>([0, 0], onChange, 1, 2);

export const createVector3 = (onChange?: (newValue: Vector3) => void) =>
  createMultiNumberInput<Vector3>([0, 0, 0], onChange, 1, 3);

export const createVector4 = (onChange?: (newValue: Vector4) => void) =>
  createMultiNumberInput<Vector4>([0, 0, 0, 0], onChange, 1, 4);
