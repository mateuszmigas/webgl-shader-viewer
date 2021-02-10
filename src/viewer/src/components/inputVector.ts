import { Vector2Array, Vector3Array, Vector4Array } from "../types";
import { createMultiNumberInput } from "./helpers";

export const createVector2 = (onChange?: (newValue: Vector2Array) => void) =>
  createMultiNumberInput<Vector2Array>([0, 0], onChange, 1, 2);

export const createVector3 = (onChange?: (newValue: Vector3Array) => void) =>
  createMultiNumberInput<Vector3Array>([0, 0, 0], onChange, 1, 3);

export const createVector4 = (onChange?: (newValue: Vector4Array) => void) =>
  createMultiNumberInput<Vector4Array>([0, 0, 0, 0], onChange, 1, 4);
