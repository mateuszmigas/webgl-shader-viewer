import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { viewerEndpoint } from "../../../common/communication/viewerEndpoint";
import { shaderExtensions } from "../constants";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import {
  compileShadersFromSource,
  createComponentsForProgram,
  getProgramAttributeBuffers,
  getProgramUniforms,
} from "../utils/webgl";
import { AttributeBufferType } from "../utils/webgl/attributeBuffer";
import { AttributeBufferSection } from "./AttributeBufferSection";
import { Dropdown, DropdownOption } from "./Dropdown";
import { OptionInput } from "./OptionInput";
import { SectionTitle } from "./SectionTitle";
import { context } from "./WebGLHost";

export function mapStateToProps(state: ViewerState) {
  return {
    selectedVertexFileId: state.vertexFilePath,
    selectedFragmentFileId: state.fragmentFilePath,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ViewerAction>) {
  return {
    setSelectedVertexFileId: (value: string | null) =>
      dispatch({ type: "SET_VERTEX_FILE_PATH", payload: { path: value } }),
    setSelectedFragmentFileId: (value: string | null) =>
      dispatch({ type: "SET_FRAGMENT_FILE_PATH", payload: { path: value } }),
  };
}

export const ShadersSelectorSection = connect(
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
    const [attributeBuffers, setAttributeBuffers] = React.useState<
      { name: string; type: AttributeBufferType }[]
    >([]);
    const [selectedVertexFileText, setSelectedVertexFileText] = React.useState("");
    const [selectedFragmentFileText, setSelectedFragmentFileText] = React.useState("");

    const syncShaderDocuments = React.useCallback(() => {
      viewerEndpoint.getWorkspaceFilesOfTypes(shaderExtensions).then(sd => {
        setShaderFileOptions(
          sd.map(f => ({
            id: f.filePath,
            display: f.fileName,
          }))
        );
      });
    }, []);

    //todo? debounce
    React.useEffect(() => {
      if (selectedVertexFileText && selectedFragmentFileText) {
        const result = compileShadersFromSource(
          context,
          selectedVertexFileText,
          selectedFragmentFileText
        );

        if (Array.isArray(result)) {
          console.log("errors", result);
        } else {
          const programUniforms = getProgramUniforms(context, result);
          const resultAttributeBuffers = getProgramAttributeBuffers(context, result);
          setAttributeBuffers(resultAttributeBuffers);
        }
      }
    }, [selectedVertexFileText, selectedFragmentFileText]);

    React.useEffect(() => {
      syncShaderDocuments();
      viewerEndpoint.getDocumentText(selectedVertexFileId).then(setSelectedVertexFileText);
      viewerEndpoint.getDocumentText(selectedFragmentFileId).then(setSelectedFragmentFileText);
      viewerEndpoint.showWebViewDevTools();
    }, []);

    React.useEffect(() => {
      const unsubscribe = viewerEndpoint.subscribeToDocumentSave(
        selectedVertexFileId,
        setSelectedVertexFileText
      );
      return () => unsubscribe();
    }, [selectedVertexFileId]);

    React.useEffect(() => {
      const unsubscribe = viewerEndpoint.subscribeToDocumentSave(
        selectedFragmentFileId,
        setSelectedFragmentFileText
      );
      return () => unsubscribe();
    }, [selectedFragmentFileId]);

    return (
      <div className="viewer-options">
        <div className="viewer-shaders-title">
          <SectionTitle text="Shaders"></SectionTitle>
          <button className="viewer-refresh-button" onClick={syncShaderDocuments}>
            Sync
          </button>
        </div>
        <OptionInput text={"Vertex Shader"}>
          <Dropdown
            selectedItemId={selectedVertexFileId}
            onChange={setSelectedVertexFileId}
            options={shaderFileOptions}
          ></Dropdown>
        </OptionInput>
        <OptionInput text={"Fragment Shader"}>
          <Dropdown
            selectedItemId={selectedFragmentFileId}
            onChange={setSelectedFragmentFileId}
            options={shaderFileOptions}
          ></Dropdown>
        </OptionInput>
        <div className="viewer-shaders-title">
          <SectionTitle text="Draw options"></SectionTitle>
        </div>
        <AttributeBufferSection elements={attributeBuffers}></AttributeBufferSection>
      </div>
    );
  }
);
