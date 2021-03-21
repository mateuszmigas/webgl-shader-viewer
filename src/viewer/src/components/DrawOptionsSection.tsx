import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { meshes } from "../meshes";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import { translations } from "../translations";
import { DrawMode } from "../utils/webgl";
import { Dropdown } from "./Dropdown";
import { IndexBufferField } from "./indexBuffer/IndexBufferField";
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
              onChange={setDrawMode as any}
              options={drawModeOptions}
            ></Dropdown>
          </SectionField>
          {drawMode === "elements" && <IndexBufferField></IndexBufferField>}
        </div>
      );
    }
  )
);
