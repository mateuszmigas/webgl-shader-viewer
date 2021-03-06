import React from "react";
import { UniformType } from "@utils/webgl/uniform/uniform";
import {
  Vector2NumberInput,
  Vector3NumberInput,
  Vector4NumberInput,
  Matrix2x2NumberInput,
  Matrix3x3NumberInput,
  Matrix4x4NumberInput,
  NumberInput,
} from "../common";
import { customOption } from "@common/constants";
import { Dropdown } from "../common/Dropdown";
import { getUniformBindingOptionsForType } from "@utils/webgl/uniform/uniformUtils";
import { assertNever } from "@utils/typeGuards";
import { useViewerDebounceSelector, useViewerDispatch } from "@viewerStore";
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
    case UniformType.BOOL:
    case UniformType.BYTE:
    case UniformType.UNSIGNED_BYTE:
    case UniformType.SHORT:
    case UniformType.UNSIGNED_SHORT:
    case UniformType.INT:
    case UniformType.UNSIGNED_INT:
      return <NumberInput {...props}></NumberInput>;
    case UniformType.FLOAT_VEC2:
    case UniformType.INT_VEC2:
    case UniformType.BOOL_VEC2:
      return <Vector2NumberInput {...props}></Vector2NumberInput>;
    case UniformType.FLOAT_VEC3:
    case UniformType.INT_VEC3:
    case UniformType.BOOL_VEC3:
      return <Vector3NumberInput {...props}></Vector3NumberInput>;
    case UniformType.FLOAT_VEC4:
    case UniformType.INT_VEC4:
    case UniformType.BOOL_VEC4:
      return <Vector4NumberInput {...props}></Vector4NumberInput>;
    case UniformType.FLOAT_MAT2:
      return <Matrix2x2NumberInput {...props}></Matrix2x2NumberInput>;
    case UniformType.FLOAT_MAT3:
      return <Matrix3x3NumberInput {...props}></Matrix3x3NumberInput>;
    case UniformType.FLOAT_MAT4:
      return <Matrix4x4NumberInput {...props}></Matrix4x4NumberInput>;
    default:
      assertNever(type);
  }
};

export const UniformField = React.memo((props: { name: string; type: number }) => {
  const { name, type } = props;
  const { optionId, value } = useViewerDebounceSelector(
    state => state.uniformValues[name],
    (oldSelected, newSelected) =>
      newSelected.optionId !== customOption.id && oldSelected.value !== newSelected.value,
    200,
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
    [dispatch, name, type]
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
    [dispatch, name, type]
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
});
