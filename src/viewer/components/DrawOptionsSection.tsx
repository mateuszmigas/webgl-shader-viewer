import React from "react";
import { meshes } from "../meshes";
import { translations } from "@common/translations";
import { DrawMode } from "@utils/webgl/types";
import { Dropdown } from "./common/Dropdown";
import { IndexBufferField } from "./indexBuffer/IndexBufferField";
import { SectionField } from "./common/SectionField";
import { SectionTitle } from "./common/SectionTitle";
import { useViewerDispatch, useViewerSelector } from "@viewerStore";

const drawModeOptions: { id: DrawMode; display: string }[] = [
  { id: "arrays", display: translations.drawOptions.drawMode.arrays },
  { id: "elements", display: translations.drawOptions.drawMode.elements },
];

const meshOptions = Array.from(meshes.entries()).map(([key, value]) => ({
  id: key,
  display: value.display,
}));

export const DrawOptionsSection = React.memo(() => {
  const drawMode = useViewerSelector(state => state.drawMode);
  const meshId = useViewerSelector(state => state.meshId);
  const dispatch = useViewerDispatch();
  const setDrawMode = React.useCallback(
    (newDrawMode: DrawMode) => dispatch({ type: "SET_DRAW_MODE", payload: { mode: newDrawMode } }),
    [dispatch]
  );
  const setMeshId = React.useCallback(
    (newMeshId: string) => dispatch({ type: "SET_MESH", payload: { id: newMeshId } }),
    [dispatch]
  );

  return (
    <div className="viewer-options-section">
      <SectionTitle text={translations.drawOptions.title}></SectionTitle>
      <SectionField text={"Mesh"}>
        <Dropdown selectedItemId={meshId} onChange={setMeshId} options={meshOptions}></Dropdown>
      </SectionField>
      <SectionField text={"Draw mode"}>
        <Dropdown
          selectedItemId={drawMode}
          onChange={setDrawMode as (_: string) => void}
          options={drawModeOptions}
        ></Dropdown>
      </SectionField>
      {drawMode === "elements" && <IndexBufferField></IndexBufferField>}
    </div>
  );
});
