import React from "react";
import { TextInput } from "../common/TextInput";
import { customOption } from "@common/constants";
import { Dropdown } from "../common/Dropdown";
import { SectionField } from "../common/SectionField";
import { translations } from "@common/translations";
import { getIndexBufferBindingOptions } from "@utils/webgl/indexBuffer/indexBufferUtils";
import { useViewerDispatch, useViewerSelector } from "@viewerStore";
import { shallowEqual } from "@utils/object";

const options = [customOption, ...getIndexBufferBindingOptions()];

export const IndexBufferField = React.memo(() => {
  const { optionId, value, error } = useViewerSelector(
    state => state.indexBufferValue,
    shallowEqual
  );
  const dispatch = useViewerDispatch();
  const setOption = React.useCallback(
    (optionId: string) =>
      dispatch({
        type: "SET_INDEX_BUFFER_OPTION",
        payload: {
          optionId,
        },
      }),
    [dispatch]
  );
  const setValue = React.useCallback(
    (value: string) =>
      dispatch({
        type: "SET_INDEX_BUFFER_VALUE",
        payload: {
          value,
        },
      }),
    [dispatch]
  );
  const isCustom = optionId === customOption.id;

  return (
    <SectionField text={translations.indices.title}>
      <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
      <TextInput value={value} onChange={setValue} error={error} readonly={!isCustom}></TextInput>
    </SectionField>
  );
});
