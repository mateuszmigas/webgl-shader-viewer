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
import { UniformType } from "../utils/webgl/uniform";
import { AttributeBufferFieldInfo, AttributeBufferSection } from "./AttributeBufferSection";
import { DrawOptionsSection } from "./DrawOptionsSection";
import { SectionTitle } from "./SectionTitle";
import { ShadersSelectorSection } from "./ShadersSelectorSection";
import { TextureFieldInfo, TextureSection } from "./TexturesSection";
import { context } from "./WebGLHost";

const mapStateToProps = (state: ViewerState) => {
  return {
    selectedVertexFileId: state.vertexFilePath,
    selectedFragmentFileId: state.fragmentFilePath,
  };
};

export const ViewerOptions = connect(mapStateToProps)(
  (props: { selectedVertexFileId: string; selectedFragmentFileId: string }) => {
    const { selectedVertexFileId, selectedFragmentFileId } = props;

    const [selectedVertexFileText, setSelectedVertexFileText] = React.useState("");
    const [selectedFragmentFileText, setSelectedFragmentFileText] = React.useState("");
    const [attributeBufferFieldsInfo, setAttributeBufferFieldsInfo] = React.useState<
      AttributeBufferFieldInfo[]
    >([]);
    const [uniformFieldsInfo, setUniformFieldsInfo] = React.useState<
      { name: string; type: UniformType }[]
    >([]);
    const [textureFieldsInfo, setTextureFieldsInfo] = React.useState<TextureFieldInfo[]>([]);

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
          setUniformFieldsInfo(programUniforms.dataUniforms);
          setTextureFieldsInfo(programUniforms.textureUniforms);
          setAttributeBufferFieldsInfo(resultAttributeBuffers);
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
        <DrawOptionsSection></DrawOptionsSection>
        <AttributeBufferSection
          attributeBufferFields={attributeBufferFieldsInfo}
        ></AttributeBufferSection>
        <TextureSection textureFields={textureFieldsInfo}></TextureSection>
      </div>
    );
  }
);
