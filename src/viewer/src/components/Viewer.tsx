import React from "react";
import { connect } from "react-redux";
import { viewerEndpoint } from "../../../common/communication/viewerEndpoint";
import { ViewerState } from "../store/state";
import { observeElementBoundingRect } from "../utils/html";
import {
  compileShadersFromSource,
  formatShaderCompileErrors,
  getProgramAttributeBuffers,
  getProgramUniforms,
  renderProgram,
} from "../utils/webgl";
import { createAttributeBufferInfos } from "../utils/webgl/attributeBufferStore";
import { IndexBufferInfo } from "../utils/webgl/indexBuffer";
import { UniformType } from "../utils/webgl/uniform";
import { DrawOptionsSection } from "./DrawOptionsSection";
import { ShadersSelectorSection } from "./ShadersSelectorSection";
import { TextureFieldInfo, TextureSection } from "./textures/TexturesSection";
import { UniformSection } from "./uniforms/UniformsSection";
import { ShadersCompileResultArea } from "./ShadersCompileResultArea";
import { usePerspectiveCamera } from "../hooks/usePerspectiveCamera";
import { Dispatch } from "redux";
import { ViewerAction } from "../store/actions";
import { useDocumentWatcher } from "../hooks/useDocumentWatcher";
import {
  AttributeBufferFieldInfo,
  AttributeBuffersSection,
} from "./attributeBuffers/AttributeBuffersSection";
import { createUniformInfos } from "../utils/webgl/uniformStore";
import { setWebGLFromState } from "../utils/webgl/storeWatcher";
import { store } from "..";
import { CameraPosition } from "../utils/cameraManipulator";

const mapStateToProps = (state: ViewerState) => {
  return {
    selectedVertexFileId: state.vertexFilePath,
    selectedFragmentFileId: state.fragmentFilePath,
    cameraPosition: state.cameraPosition,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setCameraPosition: (newCameraPosition: CameraPosition) =>
      dispatch({ type: "SET_CAMERA_POSITION", payload: { position: newCameraPosition } }),
    setViewerSize: (size: { width: number; height: number }) =>
      dispatch({ type: "SET_VIWER_SIZE", payload: { size } }),
  };
};

export const Viewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props: {
    selectedVertexFileId: string;
    selectedFragmentFileId: string;
    cameraPosition: CameraPosition;
    setCameraPosition: (newCameraPosition: CameraPosition) => void;
    setViewerSize: (size: { width: number; height: number }) => void;
  }) => {
    const {
      selectedVertexFileId,
      selectedFragmentFileId,
      cameraPosition,
      setCameraPosition,
      setViewerSize,
    } = props;

    const [shaderCompileErrors, setShaderCompileErrors] = React.useState("");
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

      observeElementBoundingRect(contentRef.current, rect => {
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
        setViewerSize({ ...rect });
      });

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
        setShaderCompileErrors(formatShaderCompileErrors(result));
      } else {
        setShaderCompileErrors("");
        const program = result;
        const programUniforms = getProgramUniforms(contextRef.current, program);
        const programAttributeBuffers = getProgramAttributeBuffers(contextRef.current, program);
        setUniformFieldsInfo(programUniforms.dataUniforms);
        setTextureFieldsInfo(programUniforms.textureUniforms);
        setAttributeBufferFieldsInfo(programAttributeBuffers);
        const attributeBufferInfos = createAttributeBufferInfos(
          contextRef.current,
          program,
          programAttributeBuffers
        );
        const uniformInfos = createUniformInfos(
          contextRef.current,
          program,
          programUniforms.dataUniforms
        );

        setWebGLFromState();

        const render = () => {
          const { drawMode } = store.getState();
          renderProgram(
            contextRef.current,
            program,
            {
              uniformInfos: uniformInfos,
              textureInfos: [],
              attributeBufferInfos,
              indexBufferInfo: indexBufferInfoRef.current,
            },
            { drawMode }
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

    usePerspectiveCamera(contentRef.current, cameraPosition, setCameraPosition);
    useDocumentWatcher(selectedVertexFileId, setSelectedVertexFileText);
    useDocumentWatcher(selectedFragmentFileId, setSelectedFragmentFileText);

    return (
      <div className="viewer-grid">
        <div className="viewer-options">
          <ShadersSelectorSection></ShadersSelectorSection>
          <DrawOptionsSection></DrawOptionsSection>
          {uniformFieldsInfo.length > 0 && (
            <UniformSection uniformFields={uniformFieldsInfo}></UniformSection>
          )}
          {attributeBufferFieldsInfo.length > 0 && (
            <AttributeBuffersSection
              attributeBufferFields={attributeBufferFieldsInfo}
            ></AttributeBuffersSection>
          )}
          {textureFieldsInfo.length > 0 && (
            <TextureSection textureFields={textureFieldsInfo}></TextureSection>
          )}
        </div>
        <div ref={contentRef} className="viewer-content">
          {shaderCompileErrors && (
            <ShadersCompileResultArea errors={shaderCompileErrors}></ShadersCompileResultArea>
          )}
          <canvas className="viewer-canvas" ref={canvasRef}></canvas>
        </div>
      </div>
    );
  }
);
