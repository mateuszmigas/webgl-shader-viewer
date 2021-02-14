import { createElementsDropdown } from "../../components/dropdown";
import { createMatrix } from "../../components/inputMatrix";
import { createVector } from "../../components/inputVector";
import { createDiv } from "../../components/wrappers";
import { Observable } from "../observable";

export const createElementNotSupported = () => {
  const div = document.createElement("div");
  div.className = "unsupported-error";
  div.innerText = "Not supported uniform";
  return div;
};

export const createSelectionComponent = (
  options: {
    id: string;
    display: string;
    value: Observable<any>;
    element: HTMLElement;
  }[],
  onChange: (value: any) => void
) => {
  let detach: () => void = null;
  const element = createDiv("column-with-gap", [
    createElementsDropdown(options, id => {
      detach?.();
      const option = options.find(o => o.id === id);
      const callback = (value: any) => onChange(value);
      option.value.attach(callback);
      callback(option.value.getValue());
      detach = () => option.value.detach(callback);
    }),
    ...options.map(o => o.element),
  ]);

  return {
    element,
    dispose: () => detach?.(),
  };
};

export const createElementVector = <T extends number[]>(
  size: number,
  value: Observable<T>,
  editable: boolean
) => {
  const [customElement, customController] = createVector(size, v => {
    value.setValue(v as T);
  });
  customController.setValues(value.getValue());

  if (!editable) {
    const listener = (value: T) => customController.setValues(value);
    value.attach(listener);
  }

  return customElement;
};

export const createElementMatrix = <T extends number[]>(
  size: number,
  value: Observable<T>,
  editable: boolean
) => {
  const onChange = editable
    ? (v: T) => {
        value.setValue(v as T);
      }
    : undefined;
  const [customElement, customController] = createMatrix(size, onChange);
  customController.setValues(value.getValue());

  if (!editable) {
    const listener = (value: T) => customController.setValues(value);
    value.attach(listener);
  }

  return customElement;
};

//todo better parser
export const createElementArray = <T extends number[]>(
  itemSize: number,
  value: Observable<T>,
  editable: boolean
) => {
  const input = document.createElement("input");
  input.className = "edit-input";
  input.disabled = !editable;

  if (!editable) {
    const listener = (value: T) => (input.value = JSON.stringify(value));
    value.attach(listener);
  }

  input.value = JSON.stringify(value.getValue());
  input.oninput = () => {
    try {
      const result = JSON.parse(input.value);
      //console.log("result", result);

      if (!Array.isArray(result)) {
        if (itemSize !== 1) console.log("this is not an array type");
      } else {
        const xxx = result.every(e =>
          Array.isArray(e) ? e.length === itemSize : false
        );
        if (!xxx) {
          console.log("not every element id the arra is same size");
        }
      }
      value.setValue(result);
    } catch (error) {
      console.log("this is not a json");
    }
  };

  //Wrong format! Should be [[x1,y1], [x2,y2], ...]
  return input;
};
