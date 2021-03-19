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
  return attibuteBufferValue?.type === ownProps.type
    ? { ...attibuteBufferValue }
    : { ...getDefaultProps(ownProps.type) };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setState2: (state: FieldState) => {
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

type NewType = {
  name: string;
  type: number;
  optionId: string;
  value: string;
  isValid: boolean;
  setState: (state: FieldState) => void;
};

export class Inner extends React.PureComponent<NewType> {
  constructor(props: NewType) {
    super(props);
  }

  render() {
    const props = this.props;
    console.log("render", props);

    const { type, setState: setState2 } = props;
    const { value, optionId: dupad, isValid } = props;

    const onChange = (value: string, isValid: boolean) => {
      console.log("settings state in input field", props, this.props);

      props.setState({ optionId: props.optionId, value, isValid });
    };

    const options = [customOption, ...getBindingOptions(type)];

    return (
      <div>
        {options.length > 1 && (
          <Dropdown
            selectedItemId={dupad}
            onChange={optionId2 => {
              console.log("setting from combo");

              setState2({ value, isValid, optionId: optionId2 });
            }}
            options={options}
          ></Dropdown>
        )}
        {renderAttributeBufferInput(type, {
          value,
          onChange: onChange,
          readonly: dupad !== customOption.id,
        })}
      </div>
    );
  }
}

export const AttributeBufferField = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props: {
    name: string;
    type: number;
    optionId: string;
    value: string;
    isValid: boolean;
    setState2: (state: FieldState) => void;
  }) => {
    return (
      <Inner
        {...props}
        setState={ns => {
          props.setState2({ ...ns, optionId: ns.optionId });
          console.log("setting to state", ns.optionId);
        }}
      ></Inner>
    );
  }
);
