import React from "react";
import { connect } from "react-redux";
import { viewerEndpoint } from "communication/viewerEndpoint";
import { ViewerState } from "../store/state";
import { observeElementBoundingRect } from "@utils/html";
import {
  compileShadersFromSource,
  formatShaderCompileErrors,
  getProgramAttributeBuffers,
  getProgramUniforms,
  renderProgram,
} from "@utils/webgl";
import { DrawOptionsSection } from "./DrawOptionsSection";
import { ShadersSelectorSection } from "./ShadersSelectorSection";
import { usePerspectiveCamera } from "../hooks/usePerspectiveCamera";
import { Dispatch } from "redux";
import { ViewerAction } from "../store/actions";
import { useDocumentWatcher } from "../hooks/useDocumentWatcher";
import { CameraPosition } from "@utils/cameraManipulator";
import { commitStateOnInit, commitStateOnRender } from "@utils/webgl/stateMediator";
import { translations } from "@common/translations";
import { imagesExtensions, shaderExtensions, __prod__ } from "@common/constants";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer/attributeBuffer";
import { UniformType } from "@utils/webgl/uniform/uniform";
import { UniformSection } from "./uniform/UniformsSection";
import { AttributeBuffersSection } from "./attributeBuffer/AttributeBuffersSection";
import { TextureSection } from "./texture/TexturesSection";
import { getOrCreateAttributeBufferInfos } from "@utils/webgl/attributeBuffer/attributeBufferStore";
import { getOrCreateIndexBufferInfo } from "@utils/webgl/indexBuffer/indexBufferStore";
import { getOrCreateTextureInfos } from "@utils/webgl/texture/textureStore";
import { getOrCreateUniformInfos } from "@utils/webgl/uniform/uniformStore";
import { store } from "@viewerStore";

const mapStateToProps = (state: ViewerState) => {
  return {
    selectedVertexFileId: state.vertexFilePath,
    selectedFragmentFileId: state.fragmentFilePath,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setCameraPosition: (newCameraPosition: CameraPosition) =>
      dispatch({ type: "SET_CAMERA_POSITION", payload: { position: newCameraPosition } }),
    setViewerSize: (size: { width: number; height: number }) =>
      dispatch({ type: "SET_VIWER_SIZE", payload: { size } }),
    setNewShaderInfo: (
      attributeBuffersInfos: { name: string; type: AttributeBufferType }[],
      uniformInfos: { name: string; type: UniformType }[],
      texturesInfos: { name: string }[]
    ) =>
      dispatch({
        type: "REBUILD_SHADER_INFO",
        payload: { attributeBuffersInfos, uniformInfos, texturesInfos },
      }),
    setWorkspaceImageOptions: (options: { id: string; display: string }[]) =>
      dispatch({ type: "SET_WORKSPACE_IMAGE_OPTIONS", payload: { options } }),
    setWorkspaceShaderOptions: (options: { id: string; display: string }[]) =>
      dispatch({ type: "SET_WORKSPACE_SHADER_OPTIONS", payload: { options } }),
  };
};

export const Viewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  React.memo(
    (props: {
      selectedVertexFileId: string;
      selectedFragmentFileId: string;
      setCameraPosition: (newCameraPosition: CameraPosition) => void;
      setViewerSize: (size: { width: number; height: number }) => void;
      setNewShaderInfo: (
        attributeBuffersInfos: { name: string; type: AttributeBufferType }[],
        uniformInfos: { name: string; type: UniformType }[],
        texturesInfos: { name: string }[]
      ) => void;
      setWorkspaceImageOptions: (options: { id: string; display: string }[]) => void;
      setWorkspaceShaderOptions: (options: { id: string; display: string }[]) => void;
    }) => {
      const {
        selectedVertexFileId,
        selectedFragmentFileId,
        setCameraPosition,
        setViewerSize,
        setNewShaderInfo,
        setWorkspaceImageOptions,
        setWorkspaceShaderOptions,
      } = props;

      const [shaderCompileErrors, setShaderCompileErrors] = React.useState("");
      const [selectedVertexFileText, setSelectedVertexFileText] = React.useState("");
      const [selectedFragmentFileText, setSelectedFragmentFileText] = React.useState("");
      const contentRef = React.useRef<HTMLDivElement>(null);
      const canvasRef = React.useRef<HTMLCanvasElement>(null);
      const contextRef = React.useRef<WebGLRenderingContext>(null);
      const animationFrameHandleRef = React.useRef<number | null>(null);

      const syncWorkspaceOptions = React.useCallback(async () => {
        const [shaderFiles, imageFiles] = await Promise.all([
          viewerEndpoint.getWorkspaceFilesOfTypes(shaderExtensions),
          viewerEndpoint.getWorkspaceFilesOfTypes(imagesExtensions),
        ]);

        setWorkspaceShaderOptions(
          shaderFiles.map(file => ({
            id: file.filePath,
            display: file.fileName,
          }))
        );

        setWorkspaceImageOptions(
          imageFiles.map(file => ({ id: file.uri, display: file.fileName }))
        );
      }, [setWorkspaceShaderOptions, setWorkspaceImageOptions]);

      //startup
      React.useEffect(() => {
        contextRef.current = canvasRef.current.getContext("webgl");

        if (!contextRef.current) {
          throw new Error(translations.errors.contextNotCreated);
        }

        observeElementBoundingRect(contentRef.current, rect => {
          canvasRef.current.width = rect.width;
          canvasRef.current.height = rect.height;
          setViewerSize({ ...rect });
        });

        //if (!__prod__) {
        viewerEndpoint.showWebViewDevTools();
        //}
        syncWorkspaceOptions();
      }, [setViewerSize]);

      React.useEffect(() => {
        if (!selectedVertexFileText || !selectedFragmentFileText) {
          return;
        }

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

          setNewShaderInfo(
            programAttributeBuffers,
            programUniforms.dataUniforms,
            programUniforms.textureUniforms
          );

          const attributeBufferInfos = getOrCreateAttributeBufferInfos(
            contextRef.current,
            program,
            programAttributeBuffers
          );
          const uniformInfos = getOrCreateUniformInfos(
            contextRef.current,
            program,
            programUniforms.dataUniforms
          );
          const textureInfos = getOrCreateTextureInfos(
            contextRef.current,
            program,
            programUniforms.textureUniforms
          );
          const indexBufferInfo = getOrCreateIndexBufferInfo(contextRef.current);

          commitStateOnInit();

          const render = () => {
            const state = store.getState();
            commitStateOnRender(state);

            renderProgram(
              contextRef.current,
              program,
              {
                uniformInfos,
                textureInfos,
                attributeBufferInfos,
                indexBufferInfo,
              },
              { drawMode: state.drawMode }
            );

            animationFrameHandleRef.current = requestAnimationFrame(render);
          };

          render();

          return () => {
            cancelAnimationFrame(animationFrameHandleRef.current);
            contextRef.current.deleteProgram(result);
          };
        }
      }, [selectedVertexFileText, selectedFragmentFileText]);

      usePerspectiveCamera(contentRef.current, store.getState().cameraPosition, setCameraPosition);
      useDocumentWatcher(selectedVertexFileId, setSelectedVertexFileText);
      useDocumentWatcher(selectedFragmentFileId, setSelectedFragmentFileText);

      return (
        <div className="viewer-grid">
          <div className="viewer-options">
            <button className="component-button" onClick={syncWorkspaceOptions}>
              {translations.synchronize}
            </button>
            <ShadersSelectorSection></ShadersSelectorSection>
            <DrawOptionsSection></DrawOptionsSection>
            <UniformSection></UniformSection>
            <AttributeBuffersSection></AttributeBuffersSection>
            <TextureSection></TextureSection>
          </div>
          <div ref={contentRef} className="viewer-content">
            {shaderCompileErrors && (
              <div className="viewer-content-errors">{shaderCompileErrors}</div>
            )}
            <canvas className="viewer-content-canvas" ref={canvasRef}></canvas>
          </div>
        </div>
      );
    }
  )
);
