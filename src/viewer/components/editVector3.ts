import { createDiv } from "./common";
export const createMultiNumberInput = <T extends number[]>(
  initialValue: T,
  onChange: (newValue: T) => void,
  rows: number,
  columns: number,
  inputOptions?: Partial<HTMLInputElement>
): [
  HTMLDivElement,
  {
    setValues: (value: T) => void;
    setReadonly: (readonly: boolean) => void;
    getValues: () => T;
  }
] => {
  const inputGrid = document.createElement("div");
  inputGrid.className = "edit-input-grid";

  const itemElements: { element: HTMLInputElement; value: number }[] = [];
  const setValues = (newValues: T) =>
    itemElements.forEach((ie, index) => {
      ie.value = newValues[index];
      ie.element.value = ie.value.toString();
    });
  const getValues = () => itemElements.map((ie) => ie.value) as T;
  const setReadonly = (readonly: boolean) =>
    itemElements.forEach((ie) => (ie.element.readOnly = readonly));

  for (let row = 0; row < rows; row++) {
    const inputRow = document.createElement("div");
    inputRow.className = "edit-input-row";

    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      const value = initialValue[index];
      const input = document.createElement("input");
      const itemElement = { element: input, value };
      Object.assign(input, inputOptions);
      input.className = "edit-input";
      input.type = "number";
      input.value = value?.toString();
      input.oninput = () => {
        itemElements[index].value = Number(input.value);
        onChange?.(getValues());
      };
      itemElements.push(itemElement);
      inputRow.appendChild(input);
    }

    inputGrid.appendChild(inputRow);
  }

  return [
    inputGrid,
    {
      setValues,
      getValues,
      setReadonly,
    },
  ];
};

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

export type Vector2 = [number, number];
export const createVector2 = (onChange?: (newValue: Vector2) => void) =>
  createMultiNumberInput<Vector2>([0, 0], onChange, 1, 2);

export type Vector3 = [number, number, number];
export const createVector3 = (onChange?: (newValue: Vector3) => void) =>
  createMultiNumberInput<Vector3>([0, 0, 0], onChange, 1, 3);

export type Vector4 = [number, number, number, number];
export const createVector4 = (onChange?: (newValue: Vector4) => void) =>
  createMultiNumberInput<Vector4>([0, 0, 0, 0], onChange, 1, 4);
