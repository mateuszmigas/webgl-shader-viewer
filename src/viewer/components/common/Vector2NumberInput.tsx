import React from "react";
import { MultiNumberInput } from "./MultiNumberInput";

const defaultValue = [0, 0];

export const Vector2NumberInput = (props: {
  value: number[];
  onChange: (newValue: number[]) => void;
}) => (
  <MultiNumberInput
    {...props}
    rows={1}
    columns={2}
    value={props.value ?? defaultValue}
  ></MultiNumberInput>
);
