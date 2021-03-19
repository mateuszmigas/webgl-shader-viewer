import React from "react";

type ArrayNumberInputProps = {
  value: string;
  onChange: (newValue: string, isValid: boolean) => void;
  elementSize: number;
  readonly?: boolean;
};

export const ArrayNumberInput = React.memo((props: ArrayNumberInputProps) => {
  const { value, elementSize, readonly } = props;
  const errorRef = React.useRef("");

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newError = "";

      try {
        const parsedResult = JSON.parse(e.target.value);
        if (!Array.isArray(parsedResult)) {
          newError = "this is not an array type";
        } else {
          const isEveryElementCorrectSize = parsedResult.every(e =>
            Array.isArray(e) ? e.length === elementSize : false
          );
          if (!isEveryElementCorrectSize) {
            newError = "not every element id the arra is same size";
          }
        }
      } catch {
        newError = "this is not a valid format";
      }

      errorRef.current = newError;
      props.onChange(e.target.value, !newError);
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
