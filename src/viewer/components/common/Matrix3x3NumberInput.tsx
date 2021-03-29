import React from "react";
import { repeat } from "@utils/array";
import { MultiNumberInput } from "./MultiNumberInput";

const defaultValue = repeat(16, 0);

export const Matrix3x3NumberInput = (props: {
  value: number[];
  onChange: (newValue: number[]) => void;
}) => (
  <MultiNumberInput
    {...props}
    rows={3}
    columns={3}
    value={props.value ?? defaultValue}
  ></MultiNumberInput>
);
