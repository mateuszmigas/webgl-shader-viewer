import React from "react";

export const NumberInput = (props: {
  value: number;
  onChange: (newValue: number) => void;
  readonly: boolean;
}) => (
  <input
    className={`component-input ${props.readonly ? "component-input-readonly" : ""}`}
    type="number"
    disabled={props.readonly}
    value={props.value}
    onChange={e => props.onChange(Number(e.target.value))}
  ></input>
);
