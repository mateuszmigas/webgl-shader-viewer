import React from "react";
import { UniformType } from "@utils/webgl/uniform/uniform";
import {
  Vector2NumberInput,
  Vector3NumberInput,
  Vector4NumberInput,
  Matrix3x3NumberInput,
  Matrix4x4NumberInput,
  NumberInput,
} from "../common";
import { customOption } from "@common/constants";
import { Dropdown } from "../common/Dropdown";
import { getUniformBindingOptionsForType } from "@utils/webgl/uniform/uniformUtils";
import { assertNever } from "@utils/typeGuards";
import { useViewerDebounceSelector, useViewerDispatch, useViewerSelector } from "@viewerStore";
import { shallowEqual } from "@utils/object";

const renderUniformInput = (
  type: UniformType,
  props: {
    value: any;
    onChange: (newValue: any) => void;
    readonly: boolean;
  }
) => {
  switch (type) {
    case UniformType.FLOAT:
      return <NumberInput {...props}></NumberInput>;
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

export const UniformField = React.memo(
  (props: { name: string; type: number }) => {
    console.log("rendering UniformField", props.name);
    const { name, type } = props;
    const { optionId, value } = useViewerDebounceSelector(
      state => state.uniformValues[name],
      (oldSelected, newSelected) =>
        newSelected.optionId !== customOption.id && oldSelected.value !== newSelected.value,
      500,
      shallowEqual
    );
    const options = React.useMemo(() => [customOption, ...getUniformBindingOptionsForType(type)], [
      type,
    ]);

    const dispatch = useViewerDispatch();

    const setOption = React.useCallback(
      (optionId: string) =>
        dispatch({
          type: "SET_UNIFORM_OPTION",
          payload: {
            name,
            type,
            optionId,
          },
        }),
      [dispatch]
    );

    const setValue = React.useCallback(
      (value: string) =>
        dispatch({
          type: "SET_UNIFORM_VALUE",
          payload: {
            name,
            type,
            value,
          },
        }),
      [dispatch]
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
  // {
  //   shouldDebounce: (oldProps, newProps) =>
  //     newProps.optionId !== customOption.id && oldProps.value !== newProps.value,
  //   waitMs: 100,
  // }
);
