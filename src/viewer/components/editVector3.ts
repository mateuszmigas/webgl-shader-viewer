

export const createMultiEdit = (initialValue: number[], onChange: (newValue: number[]) => void, rows: number, columns: number) => {
    const inputGrid = document.createElement("div");
    inputGrid.className = "edit-input-grid";

    let values = [...initialValue];

    for (let row = 0; row < rows; row++) {
        const inputRow = document.createElement("div");
        inputRow.className = "edit-input-row";

        for (let column = 0; column < columns; column++) {
            const index = row * columns + column;
            const input = document.createElement("input");
            input.className = "edit-input";
            input.type = "number";
            console.log(index);

            input.value = initialValue[index]?.toString();
            input.oninput = () => {
                values[index] = Number(input.value);
                onChange(values)
            };
            inputRow.appendChild(input)

        }

        inputGrid.appendChild(inputRow);
    }

    return inputGrid;
}

export const createMatrix3 = () => createMultiEdit([0, 1, 2, 3, 4, 5, 6, 7, 8], val => console.log(val), 3, 4);
export const createVector3 = () => createMultiEdit([1, 3, 4], val => console.log(val), 1, 3);
export const createVector4 = () => createMultiEdit([1, 3, 4, 5], val => console.log(val), 1, 4);

