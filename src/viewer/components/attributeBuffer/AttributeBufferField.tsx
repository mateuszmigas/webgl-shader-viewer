import React from "react";
import { TextInput } from "../common/TextInput";
import { customOption } from "@common/constants";
import { Dropdown } from "../common/Dropdown";
import { getAttributeBufferBindingOptionsForType } from "@utils/webgl/attributeBuffer/attributeBufferUtils";
import { useViewerDispatch, useViewerSelector } from "@viewerStore";
import { shallowEqual } from "@utils/object";

export const AttributeBufferField = React.memo((props: { name: string; type: number }) => {
  const { name, type } = props;
  const { value, optionId, error } = useViewerSelector(
    state => state.attributeBufferValues[name],
    shallowEqual
  );

  const dispatch = useViewerDispatch();

  const setOption = React.useCallback(
    (optionId: string) =>
      dispatch({
        type: "SET_ATTRIBUTE_BUFFER_OPTION",
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
        type: "SET_ATTRIBUTE_BUFFER_VALUE",
        payload: {
          name,
          type,
          value,
        },
      }),
    [dispatch, name, type]
  );

  const options = [customOption, ...getAttributeBufferBindingOptionsForType(type)];
  const isCustom = optionId === customOption.id;

  return (
    <div>
      {options.length > 1 && (
        <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
      )}
      <TextInput value={value} onChange={setValue} error={error} readonly={!isCustom}></TextInput>
    </div>
  );
});
