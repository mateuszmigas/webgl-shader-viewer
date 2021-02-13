export const createMultiNumberInput = <T extends number[]>(
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
  const getValues = () => itemElements.map(ie => ie.value) as T;
  const setReadonly = (readonly: boolean) =>
    itemElements.forEach(ie => (ie.element.readOnly = readonly));

  for (let row = 0; row < rows; row++) {
    const inputRow = document.createElement("div");
    inputRow.className = "edit-input-row";

    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      const value = 0;
      const input = document.createElement("input");
      const itemElement = { element: input, value };
      Object.assign(input, inputOptions);
      input.className = "edit-input";
      input.type = "number";
      input.value = value?.toString();
      input.oninput = () => {
        itemElements[index].value = Number(input.value);
        console.log("calling on change");

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
