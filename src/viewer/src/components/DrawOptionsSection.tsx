import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { meshes } from "../meshes";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import { translations } from "../translations";
import { DrawMode, DrawOptions } from "../utils/webgl";
import { ArrayNumberInput } from "./common/ArrayNumberInput";
import { Dropdown } from "./Dropdown";
import { SectionField } from "./SectionField";
import { SectionTitle } from "./SectionTitle";

const drawModeOptions: { id: DrawMode; display: string }[] = [
  { id: "arrays", display: "Arrays" },
  { id: "elements", display: "Elements" },
];

const meshOptions = Array.from(meshes.entries()).map(([key, value]) => ({
  id: key,
  display: value.display,
}));

//     [
//       {
//         id: "custom",
//         display: "Custom",
//         value: customIndicesValue,
//         element: createElementArray(1, customIndicesValue, true),
//       },
//       {
//         id: "binding",
//         display: "Binding - Mesh indices",
//         value: indexBufferBinding,
//         element: createElementArray(1, indexBufferBinding, false),
//       },
//     ],

const mapStateToProps = (state: ViewerState) => {
  return {
    drawMode: state.drawMode,
    meshId: state.meshId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setDrawMode: (newDrawMode: DrawMode) =>
      dispatch({ type: "SET_DRAW_MODE", payload: { mode: newDrawMode } }),
    setMeshId: (newMeshId: string) => dispatch({ type: "SET_MESH", payload: { id: newMeshId } }),
  };
};

export const DrawOptionsSection = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      drawMode: DrawMode;
      meshId: string;
      setDrawMode: (newDrawMode: DrawMode) => void;
      setMeshId: (newMeshId: string) => void;
    }) => {
      const { drawMode, meshId, setDrawMode, setMeshId } = props;
      return (
        <div className="viewer-options-section">
          <SectionTitle text={translations.drawOptions}></SectionTitle>
          <SectionField text={"Mesh"}>
            <Dropdown selectedItemId={meshId} onChange={setMeshId} options={meshOptions}></Dropdown>
          </SectionField>
          <SectionField text={"Draw mode"}>
            <Dropdown
              selectedItemId={drawMode}
              onChange={setDrawMode}
              options={drawModeOptions}
            ></Dropdown>
          </SectionField>
          {drawMode === "elements" && (
            <SectionField text={"Indices"}>
              <Dropdown
                selectedItemId={drawMode}
                onChange={setDrawMode}
                options={drawModeOptions}
              ></Dropdown>
              {/* <ArrayNumberInput {...props} elementSize={2}></ArrayNumberInput> */}
            </SectionField>
          )}
        </div>
      );
    }
  )
);

// const createViewer = async () => {
//   const indexBufferInfo = new IndexBufferInfo(webGLController.context);
//   const indexBufferBindingValue = new Observable<number[]>([]);

//   const onMeshChanged = (id: string) => {

//     indexBufferBindingValue.setValue(indices);
//   };

//   const {
//     element: indexBufferElement,
//   } = createIndexBufferComponent(indexBufferBindingValue, newValue =>
//     indexBufferInfo.setValue(newValue)
//   );
//   const indexBufferComponent = withLabel(indexBufferElement, "Indices");
// import { Observable } from "../observable";
// import { createSelectionComponent, createElementArray } from "./common";

// export const createIndexBufferComponent = (
//   indexBufferBinding: Observable<number[]>,
//   onChange: (newValue: number[]) => void
// ) => {
//   const customIndicesValue = new Observable<number[]>([0, 1, 2]);
//   return createSelectionComponent(
//     [
//       {
//         id: "custom",
//         display: "Custom",
//         value: customIndicesValue,
//         element: createElementArray(1, customIndicesValue, true),
//       },
//       {
//         id: "binding",
//         display: "Binding - Mesh indices",
//         value: indexBufferBinding,
//         element: createElementArray(1, indexBufferBinding, false),
//       },
//     ],
//     onChange
//   );
// };
