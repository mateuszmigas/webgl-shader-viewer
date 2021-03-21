import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { viewerEndpoint } from "communication/viewerEndpoint";
import { shaderExtensions } from "@common/constants";
import { ViewerAction } from "@localStore/actions";
import { ViewerState } from "@localStore/state";
import { translations } from "@common/translations";
import { Dropdown, DropdownOption } from "./Dropdown";
import { SectionField as SectionField } from "./SectionField";
import { SectionTitle } from "./SectionTitle";

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

export const ShadersSelectorSection = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
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
          <SectionTitle text={translations.shaders}>
            <button onClick={syncShaderDocuments}>Sync</button>
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
