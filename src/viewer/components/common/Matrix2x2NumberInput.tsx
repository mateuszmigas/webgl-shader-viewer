import React from "react";
import { repeat } from "@utils/array";
import { MultiNumberInput } from "./MultiNumberInput";

const defaultValue = repeat(4, 0);

export const Matrix2x2NumberInput = (props: {
  value: number[];
  onChange: (newValue: number[]) => void;
}) => (
  <MultiNumberInput
    {...props}
    rows={2}
    columns={2}
    value={props.value ?? defaultValue}
  ></MultiNumberInput>
);
