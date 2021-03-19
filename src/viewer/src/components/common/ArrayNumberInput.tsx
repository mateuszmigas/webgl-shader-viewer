import React from "react";

type ArrayNumberInputProps = {
  value: string;
  onChange: (newValue: string, isValid: boolean) => void;
  elementSize: number;
  readonly?: boolean;
};

const validate = (value: string, elementSize: number) => {
  try {
    const parsedResult = JSON.parse(value);
    if (!Array.isArray(parsedResult)) {
      return "this is not an array type";
    } else {
      const isEveryElementCorrectSize = parsedResult.every(item =>
        Array.isArray(item) ? item.length === elementSize : elementSize === 1
      );
      if (!isEveryElementCorrectSize) {
        return "not every element id the arra is same size";
      }
    }
  } catch {
    return "this is not a valid format";
  }

  return "";
};

export const ArrayNumberInput = React.memo((props: ArrayNumberInputProps) => {
  const { value, elementSize, readonly } = props;
  const errorRef = React.useRef(validate(value, elementSize));
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const error = validate(e.target.value, elementSize);
      errorRef.current = error;
      props.onChange(e.target.value, !error);
    },
    [elementSize]
  );

  return (
    <div>
      <input className="edit-input" disabled={readonly} value={value} onChange={onChange}></input>
      {errorRef.current && <div>{errorRef.current}</div>}
    </div>
  );
});
