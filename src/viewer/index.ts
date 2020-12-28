import { translations } from "./../translations";
import { createDropdown, DropdownItem } from "./components/dropdown";
import { Unsubscribe, VsCodeApiProxy } from "./communicationProxy";
import { createSectionTitle } from "./components/createSectionTitle";
import { createFAButton as createButton } from "./components/createFAButton";
import { withLabel } from "./components/wrappers";
import {
  createMatrix3,
  createVector3,
  createVector4,
} from "./components/editVector3";
import { appendWithShaderOptions } from "./shaderOptions";
import { createDiv } from "./components/common";
import { compileShader, createProgram } from "./webgl_utils/utils";
import { hasProperty } from "../utils";
import { isArray } from "util";

export type UniformInfo = {
  name: string;
  type: string;
  update: () => void;
};

export type AttributeBufferInfo = {};

export type CompileErrors = string[];
export type ShaderController = {};

const createWebGLCanvas = (
  className: string
  // onShadersCompiled: (payload: {
  //   uniforms: UniformInfo[];
  //   attributeBuffers: AttributeBufferInfo[];
  //   //getContext
  //   //render
  // }) => void
): [
  HTMLCanvasElement,
  {
    compileShaders: (
      vertexShaderContent: string,
      fragmentShaderContent: string
    ) => CompileErrors | ShaderController;
  }
] => {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  const context = canvas.getContext("webgl");
  if (!context) {
    throw new Error("Unable to create webgl context");
  }

  const compileShaders = (
    vertexShaderContent: string,
    fragmentShaderContent: string
  ) => {
    const vertexShader = compileShader(
      context,
      context.VERTEX_SHADER,
      vertexShaderContent
    );

    const fragmentShader = compileShader(
      context,
      context.FRAGMENT_SHADER,
      fragmentShaderContent
    );

    let vertexError: string = undefined;
    if (hasProperty(vertexShader, "error")) {
      vertexError = vertexShader.error;
    }

    let fragmentError: string = undefined;
    if (hasProperty(fragmentShader, "error")) {
      fragmentError = fragmentShader.error;
    }

    if (vertexError || fragmentError) {
      return [vertexError, fragmentError];
    }

    const program = createProgram(context, vertexShader, fragmentShader);

    //createController90

    // const numUniforms = context.getProgramParameter(
    //   program,
    //   context.ACTIVE_UNIFORMS
    // );
    // const uniformSetters = {};
    // console.log("getting uniforms", numUniforms);

    // for (let ii = 0; ii < numUniforms; ++ii) {
    //   const uniformInfo = context.getActiveUniform(program, ii);
    //   // if (isBuiltIn(uniformInfo)) {
    //   //     continue;
    //   // }
    //   let name = uniformInfo.name;
    //   console.log("uniform:", uniformInfo);
    // }

    //program.
    //generate program info

    //fragment: { errors: }
    //fragment: { errors: }

    //delete shaders

    return Promise.resolve<ShaderController>({});
  };

  return [
    canvas,
    {
      compileShaders,
    },
  ];
};

const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDiv("viewer-options");
  const shaderOptions = createDiv("viewer-shader-options");
  const shaderCompilationErrors = createDiv("viewer-content");
  shaderCompilationErrors.style.background = "red";
  const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");

  viewer.appendChild(webGLCanvas);
  viewer.appendChild(shaderCompilationErrors);
  viewer.appendChild(viewerOptions);

  const showContent = (content: "canvas" | "errors") => {
    webGLCanvas.style.visibility =
      content === "canvas" ? "visible" : "collapse";
    shaderCompilationErrors.style.visibility =
      content === "errors" ? "visible" : "collapse";
  };

  let selectedVertexFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedFragmentFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;

  const onShaderContentChanged = () => {
    shaderOptions.innerHTML = "";
    console.log({
      fragment: selectedFragmentContent,
      vertex: selectedVertexContent,
    });

    appendWithShaderOptions(shaderOptions);

    if (selectedFragmentContent && selectedVertexContent) {
      const result = webGLController.compileShaders(
        selectedVertexContent,
        selectedFragmentContent
      );

      if (Array.isArray(result)) {
        shaderCompilationErrors.style.visibility = "visible";
        const errors = result as string[];
        showContent("errors");
        shaderCompilationErrors.innerText = errors.join("\r\n");
      } else {
        const shaderController = result as ShaderController;
        showContent("canvas");
      }
    } else {
      console.log("clear");
    }
  };

  viewerOptions.appendChild(
    createDiv("viewer-shaders-title", [
      createSectionTitle(translations.shaders, "").element,
      createButton("Sync", "viewer-refresh-button", () => {
        vscodeApi.getShaderDocuments().then((sd) => {
          const files = sd.map((f) => ({
            id: f.filePath,
            display: f.fileName,
          }));

          vertexDropdownController.setItems(files);
          fragmentDropdownController.setItems(files);
        });
      }).element,
    ])
  );

  const [vertexDropdownElement, vertexDropdownController] = createDropdown(
    async (newVertex) => {
      selectedVertexFileWatcherUnsubscribe?.();

      if (newVertex) {
        selectedVertexFileWatcherUnsubscribe = vscodeApi.subscribeToDocumentSave(
          newVertex.id,
          (newContent) => {
            selectedVertexContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedVertexContent = newVertex
        ? await vscodeApi.getDocumentText(newVertex.id)
        : "";
      onShaderContentChanged();
    }
  );
  viewerOptions.appendChild(
    withLabel(
      vertexDropdownElement,
      "viewer-vertex-shader-selector",
      "Vertex Shader"
    )
  );

  const [fragmentDropdownElement, fragmentDropdownController] = createDropdown(
    async (newFragment) => {
      selectedFragmentFileWatcherUnsubscribe?.();

      if (newFragment) {
        selectedFragmentFileWatcherUnsubscribe = vscodeApi.subscribeToDocumentSave(
          newFragment.id,
          (newContent) => {
            selectedFragmentContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedFragmentContent = newFragment
        ? await vscodeApi.getDocumentText(newFragment.id)
        : "";
      onShaderContentChanged();
    }
  );
  viewerOptions.appendChild(
    withLabel(
      fragmentDropdownElement,
      "viewer-fragment-shader-selector",
      "Fragment Shader"
    )
  );

  viewerOptions.appendChild(shaderOptions);
};

createViewer();
