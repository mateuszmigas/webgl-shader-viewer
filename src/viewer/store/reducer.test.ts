import { ViewerState } from "@viewerStore/state";
import { reducer } from "./reducer";

const defaultState: ViewerState = {
  vertexFilePath: null as string,
  fragmentFilePath: null as string,
  uniformValues: {},
  attributeBufferValues: {},
  indexBufferValue: { optionId: "indices", value: "[]", error: "" },
  textureValues: {},
  cameraPosition: { longitude: 1, latitude: 1, radius: 2 },
  drawMode: "elements",
  meshId: "cube",
  viewerSize: { width: 1, height: 1 },
  userWorkspace: {
    imageOptions: [],
    shaderOptions: [],
  },
};

describe("SET_VERTEX_FILE_PATH", () => {
  test("sets fragment file path", () => {
    const newState = reducer(defaultState, {
      type: "SET_VERTEX_FILE_PATH",
      payload: { path: "c:/windows/temp" },
    });

    expect(newState.vertexFilePath).toBe("c:/windows/temp");
  });
});
