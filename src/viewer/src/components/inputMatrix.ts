import { createMultiNumberInput } from "./helpers";

export const createMatrix = <T extends number[]>(
  size: number,
  onChange?: (newValue: T) => void
) => createMultiNumberInput<T>(size, size, onChange);
