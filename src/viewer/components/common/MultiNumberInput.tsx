import React from "react";
import { range } from "@utils/array";
import { NumberInput } from "./NumberInput";

export const MultiNumberInput = React.memo(
  (props: {
    rows: number;
    columns: number;
    value: number[];
    onChange: (newValue: number[]) => void;
    readonly?: boolean;
  }) => {
    const { rows, columns, value = [], onChange, readonly = false } = props;

    return (
      <div className="component-input-grid">
        {range(rows).map(row => (
          <div key={row} className="component-input-row">
            {range(columns).map(column => {
              const index = row * columns + column;
              return (
                <NumberInput
                  key={column}
                  readonly={readonly}
                  value={value[index]}
                  onChange={newValue => onChange(value.map((v, i) => (i === index ? newValue : v)))}
                ></NumberInput>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);
