import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { viewerEndpoint } from "communication/viewerEndpoint";
import { shaderExtensions } from "@common/constants";
import { ViewerAction } from "@viewerStore/actions";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { Dropdown, DropdownOption, SectionField, SectionTitle } from "./common";

const mapStateToProps = (state: ViewerState) => {
  return {
    selectedVertexFileId: state.vertexFilePath,
    selectedFragmentFileId: state.fragmentFilePath,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setSelectedVertexFileId: (value: string | null) =>
      dispatch({ type: "SET_VERTEX_FILE_PATH", payload: { path: value } }),
    setSelectedFragmentFileId: (value: string | null) =>
      dispatch({ type: "SET_FRAGMENT_FILE_PATH", payload: { path: value } }),
  };
};

export const ShadersSelectorSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  React.memo(
    (props: {
      selectedVertexFileId: string;
      selectedFragmentFileId: string;
      setSelectedVertexFileId: (value: string | null) => void;
      setSelectedFragmentFileId: (value: string | null) => void;
    }) => {
      const {
        selectedVertexFileId,
        selectedFragmentFileId,
        setSelectedVertexFileId,
        setSelectedFragmentFileId,
      } = props;

      const [shaderFileOptions, setShaderFileOptions] = React.useState<DropdownOption[]>([]);

      const syncShaderDocuments = React.useCallback(() => {
        viewerEndpoint.getWorkspaceFilesOfTypes(shaderExtensions).then(files => {
          setShaderFileOptions(
            files.map(file => ({
              id: file.filePath,
              display: file.fileName,
            }))
          );
        });
      }, []);

      React.useEffect(() => syncShaderDocuments(), []);

      return (
        <div className="viewer-options-section">
          <SectionTitle text={translations.shaders.title}>
            <button
              className="component-button"
              title={translations.shaders.syncTooltip}
              onClick={syncShaderDocuments}
            >
              <i className={`codicon codicon-sync`}></i>
            </button>
          </SectionTitle>
          <SectionField text={translations.vertexShader}>
            <Dropdown
              selectedItemId={selectedVertexFileId}
              onChange={setSelectedVertexFileId}
              options={shaderFileOptions}
            ></Dropdown>
          </SectionField>
          <SectionField text={translations.fragmentShader}>
            <Dropdown
              selectedItemId={selectedFragmentFileId}
              onChange={setSelectedFragmentFileId}
              options={shaderFileOptions}
            ></Dropdown>
          </SectionField>
        </div>
      );
    }
  )
);
