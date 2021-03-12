import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import { translations } from "../translations";
import { UniformType } from "../utils/webgl/uniform";
import {
  Matrix4x4NumberInput,
  Vector2NumberInput,
  Vector3NumberInput,
  Vector4NumberInput,
} from "./common";
import { SectionField } from "./SectionField";
import { SectionTitle } from "./SectionTitle";

//const optionsByType =

const mapStateToProps = (state: ViewerState) => {
  return {
    values: state.uniformValues,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setValue: (name: string, type: number, value: string) =>
      dispatch({ type: "SET_UNIFORM", payload: { name, type, value } }),
  };
};

export type UniformFieldInfo = { name: string; type: UniformType };

export const UniformSection = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      uniformFields: UniformFieldInfo[];
      values: { [key: string]: { type: number; value: any } };
      setValue: (name: string, type: number, value: string) => void;
    }) => {
      const { uniformFields: UniformFields, values, setValue } = props;

      return (
        <div className="viewer-options-section">
          <SectionTitle text={translations.uniforms}></SectionTitle>
          {UniformFields.map(abi => {
            return (
              <SectionField text={abi.name}>
                {renderUniformInput(abi.type, values[abi.name]?.value, value =>
                  setValue(abi.name, abi.type, value)
                )}
              </SectionField>
            );
          })}
        </div>
      );
    }
  )
);

const renderUniformInput = (
  uniformType: UniformType,
  value: any,
  onChange: (newValue: any) => void
) => {
  switch (uniformType) {
    case UniformType.FLOAT_VEC2:
      return <Vector2NumberInput value={value} onChange={onChange}></Vector2NumberInput>;
    case UniformType.FLOAT_VEC3:
      return <Vector3NumberInput value={value} onChange={onChange}></Vector3NumberInput>;
    case UniformType.FLOAT_VEC4:
      return <Vector4NumberInput value={value} onChange={onChange}></Vector4NumberInput>;
    case UniformType.FLOAT_MAT4:
      return <Matrix4x4NumberInput value={value} onChange={onChange}></Matrix4x4NumberInput>;
    default:
      return <div>not supporter</div>;
  }
};
