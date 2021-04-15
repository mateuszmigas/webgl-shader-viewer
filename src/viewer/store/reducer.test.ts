import { AttributeBufferType } from "@utils/webgl/attributeBuffer/attributeBuffer";
import { UniformType } from "@utils/webgl/uniform/uniform";
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
  test("sets vertex file path", () => {
    const newState = reducer(defaultState, {
      type: "SET_VERTEX_FILE_PATH",
      payload: { path: "c:/windows/temp" },
    });

    expect(newState.vertexFilePath).toBe("c:/windows/temp");
  });
});

describe("SET_FRAGMENT_FILE_PATH", () => {
  test("sets fragment file path", () => {
    const newState = reducer(defaultState, {
      type: "SET_FRAGMENT_FILE_PATH",
      payload: { path: "c:/windows/temp" },
    });

    expect(newState.fragmentFilePath).toBe("c:/windows/temp");
  });
});

describe("REBUILD_SHADER_INFO", () => {
  test("sets all infos init", () => {
    const newState = reducer(defaultState, {
      type: "REBUILD_SHADER_INFO",
      payload: {
        attributeBuffersInfos: [
          {
            name: "AB1",
            type: AttributeBufferType.FLOAT_VEC2,
          },
          {
            name: "AB2",
            type: AttributeBufferType.FLOAT_VEC3,
          },
        ],
        uniformInfos: [
          {
            name: "UF1",
            type: UniformType.FLOAT,
          },
          {
            name: "UF2",
            type: UniformType.FLOAT_VEC2,
          },
        ],
        texturesInfos: [{ name: "TX1" }, { name: "TX2" }],
      },
    });

    expect(newState.attributeBufferValues).toStrictEqual({
      AB1: {
        type: AttributeBufferType.FLOAT_VEC2,
        optionId: "custom",
        value: "[]",
        error: "",
      },
      AB2: {
        type: AttributeBufferType.FLOAT_VEC3,
        optionId: "custom",
        value: "[]",
        error: "",
      },
    });

    expect(newState.uniformValues).toStrictEqual({
      UF1: {
        optionId: "custom",
        type: UniformType.FLOAT,
        value: 1,
      },
      UF2: {
        optionId: "custom",
        type: UniformType.FLOAT_VEC2,
        value: [1, 1],
      },
    });

    expect(newState.textureValues).toStrictEqual({
      TX1: {
        optionId: "texture-sky",
        customUrl: "",
        workspaceUrl: "",
        error: "",
      },
      TX2: {
        optionId: "texture-sky",
        customUrl: "",
        workspaceUrl: "",
        error: "",
      },
    });
  });

  test("preserves existing when names match", () => {
    const newState = reducer(
      {
        ...defaultState,
        attributeBufferValues: {
          AB1: {
            type: AttributeBufferType.FLOAT_VEC2,
            optionId: "custom1",
            value: "[1]",
            error: "err1",
          },
        },
        uniformValues: {
          UF1: {
            optionId: "custom1",
            type: UniformType.FLOAT,
            value: 5,
          },
        },
        textureValues: {
          TX1: {
            optionId: "o1",
            customUrl: "c1",
            workspaceUrl: "w1",
            error: "r1",
          },
        },
      },
      {
        type: "REBUILD_SHADER_INFO",
        payload: {
          attributeBuffersInfos: [
            {
              name: "AB1",
              type: AttributeBufferType.FLOAT_VEC2,
            },
            {
              name: "AB2",
              type: AttributeBufferType.FLOAT_VEC3,
            },
          ],
          uniformInfos: [
            {
              name: "UF1",
              type: UniformType.FLOAT,
            },
            {
              name: "UF2",
              type: UniformType.FLOAT_VEC2,
            },
          ],
          texturesInfos: [{ name: "TX1" }, { name: "TX2" }],
        },
      }
    );

    expect(newState.attributeBufferValues).toStrictEqual({
      AB1: {
        type: AttributeBufferType.FLOAT_VEC2,
        optionId: "custom1",
        value: "[1]",
        error: "err1",
      },
      AB2: {
        type: AttributeBufferType.FLOAT_VEC3,
        optionId: "custom",
        value: "[]",
        error: "",
      },
    });

    expect(newState.uniformValues).toStrictEqual({
      UF1: {
        optionId: "custom1",
        type: UniformType.FLOAT,
        value: 5,
      },
      UF2: {
        optionId: "custom",
        type: UniformType.FLOAT_VEC2,
        value: [1, 1],
      },
    });

    expect(newState.textureValues).toStrictEqual({
      TX1: {
        optionId: "o1",
        customUrl: "c1",
        workspaceUrl: "w1",
        error: "r1",
      },
      TX2: {
        optionId: "texture-sky",
        customUrl: "",
        workspaceUrl: "",
        error: "",
      },
    });
  });
});
