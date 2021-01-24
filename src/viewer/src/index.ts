import { Observable } from "./utils/observable";
import { translations } from "../../common/translations";
import { createDropdown } from "./components/dropdown";
import { createSectionTitle } from "./components/header";
import { createButton as createButton } from "./components/button";
import { createDiv, withLabel } from "./components/wrappers";
import { createUniformComponents } from "./utils/webgl/uniformComponent";
import {
  compileShadersFromSource,
  formatShaderCompileErrors,
  getProgramAttributeBuffers,
  getProgramUniforms,
  renderProgram,
  ShaderCompileErrors,
} from "./utils/webgl/index";
import {
  AttributeBufferBinding,
  createAttributeBufferComponents,
} from "./utils/webgl/attributeBufferComponent";
import { createWebGLCanvas } from "./components/webglCanvas";
import { ViewerEndpoint } from "../../common/communication/viewerEndpoint";
import { AttributeBufferType } from "./utils/webgl/attributeBuffer";
import { meshes } from "./meshes";

const createViewer = async () => {
  const meshAttributes: AttributeBufferBinding[] = [
    {
      name: "Binding - Cube normals",
      type: AttributeBufferType.FLOAT_VEC4,
      value: new Observable([
        [0, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.4, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.7, 0, 0, 1],
        [0.7, 0.5, 0, 1],
      ]),
    },
    {
      name: "Binding - Cube tangents",
      type: AttributeBufferType.FLOAT_VEC4,
      value: new Observable([
        [0, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.5, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.7, 0, 0, 1],
        [0.7, 0.5, 0, 1],
      ]),
    },
  ];

  //onchange udpate enwLocal
  const viewerEndpoint = new ViewerEndpoint();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDiv("viewer-options");
  const shaderOptions = createDiv("viewer-shader-options");
  const shaderCompilationErrors = createDiv("viewer-content shader-errors");
  const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");

  viewer.appendChild(webGLCanvas);
  viewer.appendChild(shaderCompilationErrors);
  viewer.appendChild(viewerOptions);

  const showContent = (content: "canvas" | "errors" | "none") => {
    webGLCanvas.style.visibility =
      content === "canvas" ? "visible" : "collapse";
    shaderCompilationErrors.style.visibility =
      content === "errors" ? "visible" : "collapse";
  };

  const syncShaderDocuments = () => {
    viewerEndpoint.getShaderDocuments().then(sd => {
      const files = sd.map(f => ({
        id: f.filePath,
        display: f.fileName,
      }));

      vertexDropdownController.setItems(files);
      fragmentDropdownController.setItems(files);
    });
  };

  let selectedVertexFileWatcherUnsubscribe: () => void | undefined;
  let selectedFragmentFileWatcherUnsubscribe: () => void | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;
  let animationFrameHandle: number = null;

  const onShaderContentChanged = () => {
    shaderOptions.innerHTML = "";
    const context = webGLController.context;

    if (selectedFragmentContent && selectedVertexContent) {
      const result = compileShadersFromSource(
        context,
        selectedVertexContent,
        selectedFragmentContent
      );

      if (Array.isArray(result)) {
        showContent("errors");
        shaderCompilationErrors.innerText = formatShaderCompileErrors(
          result as ShaderCompileErrors
        );
      } else {
        showContent("canvas");
        const program = result as WebGLProgram;
        const programUniforms = getProgramUniforms(context, program);
        const programAttributeBuffers = getProgramAttributeBuffers(
          context,
          program
        );

        const uniformComponents = createUniformComponents(
          context,
          program,
          programUniforms
        );
        uniformComponents.forEach(uc =>
          shaderOptions.appendChild(uc.component)
        );

        const attributeBufferComponents = createAttributeBufferComponents(
          context,
          program,
          programAttributeBuffers,
          meshAttributes
        );
        attributeBufferComponents.forEach(ab =>
          shaderOptions.appendChild(ab.component)
        );

        const uniformInfos = uniformComponents.map(uc => uc.uniformInfo);
        const attributeBufferInfos = attributeBufferComponents.map(
          abc => abc.attributeBufferInfo
        );

        if (animationFrameHandle !== null)
          cancelAnimationFrame(animationFrameHandle);

        const render = () => {
          renderProgram(context, program, {
            uniformInfos,
            attributeBufferInfos,
          });
          animationFrameHandle = requestAnimationFrame(render);
        };

        render();
      }
    } else {
      showContent("none");
    }
  };

  viewerOptions.appendChild(
    createDiv("viewer-shaders-title", [
      createSectionTitle(translations.shaders, "").element,
      createButton("Sync", "viewer-refresh-button", syncShaderDocuments)
        .element,
    ])
  );

  const [vertexDropdownElement, vertexDropdownController] = createDropdown(
    async newVertex => {
      selectedVertexFileWatcherUnsubscribe?.();

      if (newVertex) {
        selectedVertexFileWatcherUnsubscribe = viewerEndpoint.subscribeToDocumentSave(
          newVertex.id,
          newContent => {
            selectedVertexContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedVertexContent = newVertex
        ? await viewerEndpoint.getDocumentText(newVertex.id)
        : "";
      onShaderContentChanged();
    }
  );
  viewerOptions.appendChild(withLabel(vertexDropdownElement, "Vertex Shader"));

  const [fragmentDropdownElement, fragmentDropdownController] = createDropdown(
    async newFragment => {
      selectedFragmentFileWatcherUnsubscribe?.();

      if (newFragment) {
        selectedFragmentFileWatcherUnsubscribe = viewerEndpoint.subscribeToDocumentSave(
          newFragment.id,
          newContent => {
            selectedFragmentContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedFragmentContent = newFragment
        ? await viewerEndpoint.getDocumentText(newFragment.id)
        : "";
      onShaderContentChanged();
    }
  );
  viewerOptions.appendChild(
    withLabel(fragmentDropdownElement, "Fragment Shader")
  );

  const [meshDropdownElement, meshDropdownController] = createDropdown(() =>
    onShaderContentChanged()
  );
  meshDropdownController.setItems(meshes);
  viewerOptions.appendChild(withLabel(meshDropdownElement, "Mesh"));

  viewerOptions.appendChild(shaderOptions);

  syncShaderDocuments();
};

createViewer();
