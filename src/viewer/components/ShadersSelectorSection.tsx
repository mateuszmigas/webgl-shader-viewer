import React from "react";
import { translations } from "@common/translations";
import { Dropdown, SectionField, SectionTitle } from "./common";
import { useViewerDispatch, useViewerSelector } from "@viewerStore";

export const ShadersSelectorSection = React.memo(() => {
  console.log("rendering ShadersSelectorSection");
  const selectedVertexFileId = useViewerSelector(state => state.vertexFilePath);
  const selectedFragmentFileId = useViewerSelector(state => state.fragmentFilePath);
  const workspaceShaderOptions = useViewerSelector(state => state.userWorkspace.shaderOptions);
  const dispatch = useViewerDispatch();
  const setSelectedVertexFileId = React.useCallback(
    (value: string | null) => dispatch({ type: "SET_VERTEX_FILE_PATH", payload: { path: value } }),
    [dispatch]
  );
  const setSelectedFragmentFileId = React.useCallback(
    (value: string | null) =>
      dispatch({ type: "SET_FRAGMENT_FILE_PATH", payload: { path: value } }),
    [dispatch]
  );

  return (
    <div className="viewer-options-section">
      <SectionTitle text={translations.shaders.title}></SectionTitle>
      <SectionField text={translations.vertexShader}>
        <Dropdown
          selectedItemId={selectedVertexFileId}
          onChange={setSelectedVertexFileId}
          options={workspaceShaderOptions}
        ></Dropdown>
      </SectionField>
      <SectionField text={translations.fragmentShader}>
        <Dropdown
          selectedItemId={selectedFragmentFileId}
          onChange={setSelectedFragmentFileId}
          options={workspaceShaderOptions}
        ></Dropdown>
      </SectionField>
    </div>
  );
});
