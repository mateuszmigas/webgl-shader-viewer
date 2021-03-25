import React from "react";
import { range } from "@utils/array";

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
                <input
                  key={column}
                  className={`component-input ${readonly ? "component-input-readonly" : ""}`}
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
