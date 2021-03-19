import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "../../store/actions";
import { ViewerState } from "../../store/state";
import { AttributeBufferType } from "../../utils/webgl/attributeBuffer";
import { ArrayNumberInput } from "../common/ArrayNumberInput";
import { customOption } from "../common/constants";
import { Dropdown } from "../Dropdown";
import { getBindingOptions } from "./attributeBufferBindings";
import { getDefaultProps } from "./attributeBufferUtils";

type FieldState = { optionId: string; value: string; isValid: boolean };

type OwnProps = {
  name: string;
  type: AttributeBufferType;
};

const renderAttributeBufferInput = (
  type: AttributeBufferType,
  props: {
    value: string;
    onChange: (newValue: string, isValid: boolean) => void;
    readonly?: boolean;
  }
) => {
  switch (type) {
    case AttributeBufferType.FLOAT_VEC2:
      return <ArrayNumberInput {...props} elementSize={2}></ArrayNumberInput>;
    case AttributeBufferType.FLOAT_VEC3:
      return <ArrayNumberInput {...props} elementSize={3}></ArrayNumberInput>;
    case AttributeBufferType.FLOAT_VEC4:
      return <ArrayNumberInput {...props} elementSize={4}></ArrayNumberInput>;
    default:
      return <div>Uniform not supported</div>;
  }
};

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  const attibuteBufferValue = state.attributeBufferValues[ownProps.name];
  return {
    state:
      attibuteBufferValue?.type === ownProps.type
        ? attibuteBufferValue
        : getDefaultProps(ownProps.type),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setState: (state: FieldState) => {
      return dispatch({
        type: "SET_ATTRIBUTE_BUFFER",
        payload: {
          ...ownProps,
          ...state,
        },
      });
    },
  };
};

export const AttributeBufferField = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      name: string;
      type: number;
      state: FieldState;
      setState: (state: FieldState) => void;
    }) => {
      const { type, state, setState } = props;
      const { value, optionId } = state;
      const options = [customOption, ...getBindingOptions(type)];
      const isCustom = optionId === customOption.id;

      return (
        <div>
          {options.length > 1 && (
            <Dropdown
              selectedItemId={optionId}
              onChange={optionId => setState({ ...state, optionId })}
              options={options}
            ></Dropdown>
          )}
          {renderAttributeBufferInput(type, {
            value,
            onChange: (value, isValid) => setState({ ...state, value, isValid }),
            readonly: !isCustom,
          })}
        </div>
      );
    }
  )
);