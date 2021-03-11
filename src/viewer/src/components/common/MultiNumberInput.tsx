import React from "react";
import { range } from "../../../../common/array";

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
      <div className="edit-input-grid">
        {range(0, rows).map(row => (
          <div className="edit-input-row">
            {range(0, columns).map(column => {
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
