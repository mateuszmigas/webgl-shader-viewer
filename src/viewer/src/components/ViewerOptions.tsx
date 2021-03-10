import React from "react";
import { connect } from "react-redux";
import { viewerEndpoint } from "../../../common/communication/viewerEndpoint";
import { ViewerState } from "../store/state";
import {
  compileShadersFromSource,
  getProgramAttributeBuffers,
  getProgramUniforms,
} from "../utils/webgl";
import { AttributeBufferType } from "../utils/webgl/attributeBuffer";
import { AttributeBufferSection } from "./AttributeBufferSection";
import { SectionTitle } from "./SectionTitle";
import { ShadersSelectorSection } from "./ShadersSelectorSection";
import { context } from "./WebGLHost";

export function mapStateToProps(state: ViewerState) {
  return {
    selectedVertexFileId: state.vertexFilePath,
    selectedFragmentFileId: state.fragmentFilePath,
  };
}

export const ViewerOptions = connect(mapStateToProps)(
  (props: { selectedVertexFileId: string; selectedFragmentFileId: string }) => {
    const { selectedVertexFileId, selectedFragmentFileId } = props;

    const [attributeBuffers, setAttributeBuffers] = React.useState<
      { name: string; type: AttributeBufferType }[]
    >([]);
    const [selectedVertexFileText, setSelectedVertexFileText] = React.useState("");
    const [selectedFragmentFileText, setSelectedFragmentFileText] = React.useState("");

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
        <ShadersSelectorSection></ShadersSelectorSection>
        <div className="viewer-shaders-title">
          <SectionTitle text="Draw options"></SectionTitle>
        </div>
        <AttributeBufferSection elements={attributeBuffers}></AttributeBufferSection>
      </div>
    );
  }
);
