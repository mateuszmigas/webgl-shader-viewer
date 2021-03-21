import React from "react";
import { repeat } from "@utils/array";
import { MultiNumberInput } from "./MultiNumberInput";

const defaultValue = repeat(16, 0);

export const Matrix4x4NumberInput = (props: {
  value: number[];
  onChange: (newValue: number[]) => void;
}) => (
  <MultiNumberInput
    {...props}
    rows={4}
    columns={4}
    value={props.value ?? defaultValue}
  ></MultiNumberInput>
);
