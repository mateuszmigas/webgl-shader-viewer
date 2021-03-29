import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "@viewerStore/actions";
import { ViewerState } from "@viewerStore/state";
import { UniformType } from "@utils/webgl/uniform/uniform";
import {
  Vector2NumberInput,
  Vector3NumberInput,
  Vector4NumberInput,
  Matrix3x3NumberInput,
  Matrix4x4NumberInput,
} from "../common";
import { customOption } from "@common/constants";
import { Dropdown } from "../common/Dropdown";
import { getUniformBindingOptionsForType } from "@utils/webgl/uniform/uniformUtils";
import { assertNever } from "@utils/typeGuards";

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
    case UniformType.FLOAT_MAT3:
      return <Matrix3x3NumberInput {...props}></Matrix3x3NumberInput>;
    case UniformType.FLOAT_MAT4:
      return <Matrix4x4NumberInput {...props}></Matrix4x4NumberInput>;
    default:
      assertNever(type);
  }
};

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  return {
    ...state.uniformValues[ownProps.name],
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setOption: (optionId: string) => {
      return dispatch({
        type: "SET_UNIFORM_OPTION",
        payload: {
          ...ownProps,
          optionId,
        },
      });
    },
    setValue: (value: string) => {
      return dispatch({
        type: "SET_UNIFORM_VALUE",
        payload: {
          ...ownProps,
          value,
        },
      });
    },
  };
};

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
      setOption: (optionId: string) => void;
      setValue: (value: any) => void;
    }) => {
      const { type, optionId, value, setOption, setValue } = props;
      const options = React.useMemo(
        () => [customOption, ...getUniformBindingOptionsForType(type)],
        [type]
      );
      const isCustom = optionId === customOption.id;

      return (
        <div>
          {options.length > 1 && (
            <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
          )}
          {renderUniformInput(type, {
            value,
            onChange: isCustom ? setValue : undefined,
            readonly: !isCustom,
          })}
        </div>
      );
    }
  )
);
