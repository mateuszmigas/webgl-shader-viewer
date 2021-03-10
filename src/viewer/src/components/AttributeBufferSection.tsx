import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import { AttributeBufferType } from "../utils/webgl/attributeBuffer";
import { OptionInput } from "./OptionInput";

export function mapStateToProps(state: ViewerState) {
  return {
    values: state.attributeBufferValues,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ViewerAction>) {
  return {
    setValue: (name: string, type: number, value: string) =>
      dispatch({ type: "SET_ATTRIBUTE_BUFFER", payload: { name, type, value } }),
  };
}

export const AttributeBufferSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props: {
    elements: { name: string; type: AttributeBufferType }[];
    values: { [key: string]: { type: number; value: any } };
    setValue: (name: string, type: number, value: string) => void;
  }) => {
    const { elements, values, setValue } = props;

    return (
      <>
        {elements.map(element => {
          return (
            <OptionInput text={element.name}>
              <input
                value={values[element.name]?.value}
                onChange={e => setValue(element.name, 2, e.target.value)}
              ></input>
            </OptionInput>
          );
        })}
      </>
    );
  }
);
