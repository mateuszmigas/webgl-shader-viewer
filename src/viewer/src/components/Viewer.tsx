import React from "react";
import { connect } from "react-redux";
import { viewerEndpoint } from "../../../common/communication/viewerEndpoint";
import { ViewerState } from "../store/state";
import { observeElementBoundingRect } from "../utils/html";
import {
  compileShadersFromSource,
  getProgramAttributeBuffers,
  getProgramUniforms,
  renderProgram,
} from "../utils/webgl";
import { AttributeBufferType } from "../utils/webgl/attributeBuffer";
import { getFromCacheOrCreate } from "../utils/webgl/attributeBufferComponent";
import { IndexBufferInfo } from "../utils/webgl/indexBuffer";
import { UniformType } from "../utils/webgl/uniform";
import { AttributeBufferFieldInfo, AttributeBufferSection } from "./AttributeBufferSection";
import { DrawOptionsSection } from "./DrawOptionsSection";
import { MultiNumberInput } from "./common/MultiNumberInput";
import { SectionTitle } from "./SectionTitle";
import { ShadersSelectorSection } from "./ShadersSelectorSection";
import { TextureFieldInfo, TextureSection } from "./TexturesSection";
import { UniformSection } from "./UniformsSection";

const mapStateToProps = (state: ViewerState) => {
  return {
    selectedVertexFileId: state.vertexFilePath,
    selectedFragmentFileId: state.fragmentFilePath,
  };
};

export const Viewer = connect(mapStateToProps)(
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
    const contentRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const contextRef = React.useRef<WebGLRenderingContext>(null);
    const indexBufferInfoRef = React.useRef<IndexBufferInfo>(null);
    const animationFrameHandleRef = React.useRef<number | null>(null);

    //startup
    React.useEffect(() => {
      contextRef.current = canvasRef.current.getContext("webgl");

      if (!contextRef.current) {
        throw new Error("Unable to create webgl context");
      }

      indexBufferInfoRef.current = new IndexBufferInfo(contextRef.current);

      let width = 0;
      let height = 0;

      observeElementBoundingRect(contentRef.current, rect => {
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
        width = rect.width;
        height = rect.height;
      });

      viewerEndpoint.getDocumentText(selectedVertexFileId).then(setSelectedVertexFileText);
      viewerEndpoint.getDocumentText(selectedFragmentFileId).then(setSelectedFragmentFileText);
      viewerEndpoint.showWebViewDevTools();
    }, []);

    React.useEffect(() => {
      if (!selectedVertexFileText || !selectedFragmentFileText) return;

      const result = compileShadersFromSource(
        contextRef.current,
        selectedVertexFileText,
        selectedFragmentFileText
      );

      if (Array.isArray(result)) {
        console.log("errors", result);
      } else {
        const program = result;
        const programUniforms = getProgramUniforms(contextRef.current, program);
        const programAttributeBuffers = getProgramAttributeBuffers(contextRef.current, program);
        setUniformFieldsInfo(programUniforms.dataUniforms);
        setTextureFieldsInfo(programUniforms.textureUniforms);
        setAttributeBufferFieldsInfo(programAttributeBuffers);
        const newLocal = getFromCacheOrCreate(contextRef.current, program, programAttributeBuffers);

        const render = () => {
          renderProgram(
            contextRef.current,
            program,
            {
              uniformInfos: [],
              textureInfos: [],
              attributeBufferInfos: newLocal,
              indexBufferInfo: indexBufferInfoRef.current,
            },
            { drawMode: "arrays" }
          );

          animationFrameHandleRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
          console.log("deleting prog");

          cancelAnimationFrame(animationFrameHandleRef.current);
          contextRef.current.deleteProgram(result);
        };
      }
    }, [selectedVertexFileText, selectedFragmentFileText]);

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

    const [v, sv] = React.useState([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);

    return (
      <div className="viewer-grid">
        <div className="viewer-options">
          <MultiNumberInput
            rows={3}
            columns={4}
            value={v}
            onChange={sv}
            readonly
          ></MultiNumberInput>
          <ShadersSelectorSection></ShadersSelectorSection>
          <DrawOptionsSection></DrawOptionsSection>
          <UniformSection uniformFields={uniformFieldsInfo}></UniformSection>
          <AttributeBufferSection
            attributeBufferFields={attributeBufferFieldsInfo}
          ></AttributeBufferSection>
          <TextureSection textureFields={textureFieldsInfo}></TextureSection>
        </div>
        <div ref={contentRef} className="viewer-content">
          <canvas className="viewer-canvas" ref={canvasRef}></canvas>
        </div>
      </div>
    );
  }
);
