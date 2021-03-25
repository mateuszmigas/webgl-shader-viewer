import React from "react";

type TextInputProps = {
  value: string;
  onChange: (newValue: string) => void;
  error?: string;
  readonly?: boolean;
};

export const TextInput = React.memo((props: TextInputProps) => {
  const { value, error, onChange, readonly } = props;

  return (
    <div>
      <input
        className={`component-input ${readonly ? "component-input-readonly" : ""}`}
        disabled={readonly}
        value={value}
        onChange={e => onChange(e.target.value)}
      ></input>
      {error && <div className="component-input-error">{error}</div>}
    </div>
  );
});
