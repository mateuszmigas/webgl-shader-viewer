import React from "react";

type ArrayNumberInputProps = {
  value: string;
  onChange: (newValue: string) => void;
  error: string;
  readonly?: boolean;
};

export const ArrayNumberInput = React.memo((props: ArrayNumberInputProps) => {
  const { value, error, onChange, readonly } = props;

  return (
    <div>
      <input
        className="edit-input"
        disabled={readonly}
        value={value}
        onChange={e => onChange(e.target.value)}
      ></input>
      {error && <div>{error}</div>}
    </div>
  );
});
