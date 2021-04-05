import React from "react";
import { TextInput } from "../common/TextInput";
import { Dropdown } from "../common/Dropdown";
import { getTextureBindingOptions } from "@utils/webgl/texture/textureUtils";
import { customImageUrl, workspaceImageUrl } from "@common/constants";
import { useViewerDispatch, useViewerSelector } from "@viewerStore";

export const TextureField = React.memo((props: { name: string }) => {
  console.log("rendering texture field", props.name);

  const { name } = props;
  const { optionId, customUrl, workspaceUrl, error } = useViewerSelector(
    state => state.textureValues[name]
  );
  const workspaceImageOptions = useViewerSelector(state => state.userWorkspace.imageOptions);
  const dispatch = useViewerDispatch();
  const setOption = React.useCallback(
    (optionId: string) =>
      dispatch({
        type: "SET_TEXTURE_OPTION",
        payload: {
          name,
          optionId,
        },
      }),
    [dispatch]
  );
  const setWorkspaceUrl = React.useCallback(
    (workspaceUrl: string) => {
      return dispatch({
        type: "SET_TEXTURE_WORKSPACE_URL",
        payload: {
          name,
          workspaceUrl,
        },
      });
    },
    [dispatch]
  );
  const setCustomUrl = React.useCallback(
    (customUrl: string) =>
      dispatch({
        type: "SET_TEXTURE_CUSTOM_URL",
        payload: {
          name,
          customUrl,
        },
      }),
    [dispatch]
  );
  const options = React.useMemo(
    () => [customImageUrl, workspaceImageUrl, ...getTextureBindingOptions()],
    []
  );
  const isCustomUrl = optionId === customImageUrl.id;
  const isWorkspaceUrl = optionId === workspaceImageUrl.id;

  return (
    <div>
      {options.length > 1 && (
        <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
      )}
      {isCustomUrl && (
        <TextInput value={customUrl} error={error} onChange={setCustomUrl}></TextInput>
      )}
      {isWorkspaceUrl && (
        <Dropdown
          selectedItemId={workspaceUrl}
          onChange={setWorkspaceUrl}
          options={workspaceImageOptions}
        ></Dropdown>
      )}
    </div>
  );
});
