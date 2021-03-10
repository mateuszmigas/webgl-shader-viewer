import React from "react";

//   const showContent = (content: "canvas" | "errors" | "none") => {
//     webGLCanvas.style.visibility =
//       content === "canvas" ? "visible" : "collapse";
//     shaderCompilationErrors.style.visibility =
//       content === "errors" ? "visible" : "collapse";

//     //setElementVisibility(webGLCanvas, content === "canvas");
//     //setElementVisibility(shaderCompilationErrors, content === "errors");
//   };

// export const createUniformBindings = () =>
//   new Map<string, UniformBinding>([
//     [
//       "localToProjected",
//       {
//         name: "Binding - Camera LocalToProjected",
//         type: UniformType.FLOAT_MAT4,
//         value: new Observable([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
//       },
//     ],
//   ]);

// const setElementVisibility = (element: HTMLElement, visible: boolean) =>
//   (element.style.display = visible ? "inherit" : "none");

//   let cameraPosition: CameraPosition = { longitude: 1, latitude: 1, radius: 2 };
//   const cameraPositionManipulator = new CameraPositionManipulator(
//     webGLCanvas,
//     () => cameraPosition,
//     newPosition => {
//       cameraPosition = newPosition;

//       const fieldOfView = (45 * Math.PI) / 180; // in radians
//       const { width, height } = webGLController.getSize();
//       const aspect = width / height;
//       const zNear = 0.1;
//       const zFar = 100.0;
//       const projectionMatrix = mat4.create();
//       mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

//       const modelViewMatrix = mat4.create();
//       const vec = cameraPositionToVector3(cameraPosition);

//       mat4.lookAt(modelViewMatrix, [vec.x, vec.y, vec.z], [0, 0, 0], [0, 1, 0]);

//       const res = mat4.create();
//       mat4.multiply(res, projectionMatrix, modelViewMatrix);

//       uniformBindings.get("localToProjected").value.setValue(res);
//     }
//   );

export const ViewerContent = () => {
  return <div className="viewer-content">canvas here</div>;
};
