import React from "react";
import { Matrix3Array } from "../../types";
export const repeat = (count: number) =>
  Array(count)
    .fill({})
    .map((_, i) => i);

export const MultiNumberInput = React.memo(
  (props: {
    rows: number;
    columns: number;
    value: number[];
    onChange: (newValue: number[]) => void;
    readonly?: boolean;
  }) => {
    const { rows, columns, value, onChange, readonly = false } = props;

    return (
      <div className="edit-input-grid">
        {repeat(rows).map(row => (
          <div className="edit-input-row">
            {repeat(columns).map(column => {
              const index = row * columns + column;
              return (
                <input
                  className="edit-input"
                  type="number"
                  disabled={readonly}
                  value={value[index]}
                  onChange={e =>
                    onChange(value.map((v, i) => (i === index ? Number(e.target.value) : v)))
                  }
                ></input>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);
