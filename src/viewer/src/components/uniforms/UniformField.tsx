import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "../../store/actions";
import { ViewerState } from "../../store/state";
import { UniformType } from "../../utils/webgl/uniform";
import {
  Vector2NumberInput,
  Vector3NumberInput,
  Vector4NumberInput,
  Matrix4x4NumberInput,
} from "../common";
import { customOption } from "../common/constants";
import { Dropdown } from "../Dropdown";
import { bindingNames, getBindingOptions, getBindingValue } from "./uniformBindings";
import { getDefaultProps } from "./uniformUtils";

type OwnProps = {
  name: string;
  type: UniformType;
};

const renderUniformInput = (
  type: UniformType,
  props: {
    value: any;
    onChange: (newValue: any) => void;
    readonly: boolean;
  }
) => {
  switch (type) {
    case UniformType.FLOAT_VEC2:
      return <Vector2NumberInput {...props}></Vector2NumberInput>;
    case UniformType.FLOAT_VEC3:
      return <Vector3NumberInput {...props}></Vector3NumberInput>;
    case UniformType.FLOAT_VEC4:
      return <Vector4NumberInput {...props}></Vector4NumberInput>;
    case UniformType.FLOAT_MAT4:
      return <Matrix4x4NumberInput {...props}></Matrix4x4NumberInput>;
    default:
      return <div>Uniform not supported</div>;
  }
};

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  const uniformValue = state.uniformValues[ownProps.name];
  return uniformValue?.type === ownProps.type ? uniformValue : getDefaultProps(ownProps.type);
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setOptionAndValue: (optionId: string, value: string) => {
      dispatch({
        type: "SET_UNIFORM",
        payload: { ...ownProps, optionId, value },
      });
    },
  };
};

//: bindingNames.has(optionId) ? getBindingValue(optionId, ownProps.type) : value,

export const UniformField = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      name: string;
      type: number;
      optionId: string;
      value: any;
      setOptionAndValue: (optionId: string, value: string) => void;
    }) => {
      const { type, optionId, value, setOptionAndValue } = props;
      const options = React.useMemo(() => [customOption, ...getBindingOptions(type)], [type]);
      const isCustom = optionId === customOption.id;

      return (
        <div>
          {options.length > 1 && (
            <Dropdown
              selectedItemId={optionId}
              onChange={optionId => setOptionAndValue(optionId, value)}
              options={options}
            ></Dropdown>
          )}
          {renderUniformInput(type, {
            value,
            onChange: isCustom ? newValue => setOptionAndValue(optionId, newValue) : undefined,
            readonly: !isCustom,
          })}
        </div>
      );
    }
  )
);
