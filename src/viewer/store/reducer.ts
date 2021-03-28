import { validateIndexBuffer } from "./../validation/indexBufferValidator";
import { getExtensionState } from "@extensionState";
import { ViewerAction } from "./actions";
import { ViewerState } from "./state";
import { objectMap } from "@utils/object";
import { validateAttributeBuffer } from "../validation/attributeBufferValidator";
import { compose } from "redux";
import { convertArrayToObject } from "@utils/array";
import {
  getAttributeBufferBinding,
  getDefaultAttributeBufferState,
} from "@utils/webgl/attributeBuffer/attributeBufferUtils";
import { getDefaultUniformState, getUniformBinding } from "@utils/webgl/uniform/uniformUtils";
import { getDefaultTextureState } from "@utils/webgl/texture/textureUtils";
import { getIndexBufferBinding } from "@utils/webgl/indexBuffer/indexBufferUtils";

const initialState: ViewerState = {
  ...getExtensionState(),
  viewerSize: { width: 0, height: 0 },
};

const mainReducer = (state: ViewerState = initialState, action: ViewerAction): ViewerState => {
  switch (action.type) {
    case "SET_VERTEX_FILE_PATH": {
      return {
        ...state,
        vertexFilePath: action.payload.path,
      };
    }
    case "SET_FRAGMENT_FILE_PATH": {
      return {
        ...state,
        fragmentFilePath: action.payload.path,
      };
    }
    case "REBUILD_SHADER_INFO": {
      const attributeBufferValues = convertArrayToObject(
        action.payload.attributeBuffersInfos,
        ab => {
          const attibuteBufferValue = state.attributeBufferValues[ab.name];
          const value =
            attibuteBufferValue?.type === ab.type
              ? attibuteBufferValue
              : getDefaultAttributeBufferState(ab.name);

          return [ab.name, { type: ab.type, ...value }];
        }
      );

      const uniformValues = convertArrayToObject(action.payload.uniformInfos, uf => {
        const uniformValue = state.uniformValues[uf.name];
        const value =
          uniformValue?.type === uf.type ? uniformValue : getDefaultUniformState(uf.name, uf.type);

        return [uf.name, { type: uf.type, ...value }];
      });

      const textureValues = convertArrayToObject(action.payload.texturesInfos, tx => {
        const textureValue = state.textureValues[tx.name];
        const value = textureValue ?? getDefaultTextureState();
        return [tx.name, value];
      });

      return {
        ...state,
        attributeBufferValues,
        uniformValues,
        textureValues,
      };
    }
    case "SET_UNIFORM_OPTION": {
      const { name, optionId, ...rest } = action.payload;
      const current = state.uniformValues[name];

      return {
        ...state,
        uniformValues: {
          ...state.uniformValues,
          [name]: {
            ...current,
            ...rest,
            optionId,
          },
        },
      };
    }
    case "SET_UNIFORM_VALUE": {
      const { name, value, ...rest } = action.payload;
      const current = state.uniformValues[name];

      return {
        ...state,
        uniformValues: {
          ...state.uniformValues,
          [name]: {
            ...current,
            ...rest,
            value,
          },
        },
      };
    }
    case "SET_ATTRIBUTE_BUFFER_OPTION": {
      const { name, optionId, ...rest } = action.payload;
      const current = state.attributeBufferValues[name];
      return {
        ...state,
        attributeBufferValues: {
          ...state.attributeBufferValues,
          [name]: {
            ...current,
            ...rest,
            optionId,
          },
        },
      };
    }
    case "SET_ATTRIBUTE_BUFFER_VALUE": {
      const { name, value, ...rest } = action.payload;
      const current = state.attributeBufferValues[name];

      return {
        ...state,
        attributeBufferValues: {
          ...state.attributeBufferValues,
          [name]: {
            ...current,
            ...rest,
            value,
          },
        },
      };
    }
    case "SET_INDEX_BUFFER_OPTION": {
      const { optionId } = action.payload;
      return {
        ...state,
        indexBufferValue: {
          ...state.indexBufferValue,
          optionId,
        },
      };
    }
    case "SET_INDEX_BUFFER_VALUE": {
      const { value } = action.payload;
      return {
        ...state,
        indexBufferValue: {
          ...state.indexBufferValue,
          value,
        },
      };
    }
    case "SET_TEXTURE_OPTION": {
      const { name, optionId } = action.payload;
      const current = state.textureValues[name];
      return {
        ...state,
        textureValues: {
          ...state.textureValues,
          [name]: {
            ...current,
            optionId,
          },
        },
      };
    }
    case "SET_TEXTURE_VALUE": {
      const { name, value } = action.payload;
      const current = state.textureValues[name];
      return {
        ...state,
        textureValues: {
          ...state.textureValues,
          [name]: {
            ...current,
            value,
          },
        },
      };
    }
    case "SET_TEXTURE_LOADING_ERROR": {
      const { name, error } = action.payload;
      const current = state.textureValues[name];

      return {
        ...state,
        textureValues: {
          ...state.textureValues,
          [name]: {
            ...current,
            error,
          },
        },
      };
    }
    case "SET_VIWER_SIZE": {
      return {
        ...state,
        viewerSize: action.payload.size,
      };
    }
    case "SET_CAMERA_POSITION": {
      return {
        ...state,
        cameraPosition: action.payload.position,
      };
    }
    case "SET_MESH": {
      return {
        ...state,
        meshId: action.payload.id,
      };
    }
    case "SET_DRAW_MODE": {
      return {
        ...state,
        drawMode: action.payload.mode,
      };
    }
    default: {
      return state;
    }
  }
};

const applyAttributeBufferBindingsReducer = (state: ViewerState): ViewerState => {
  return {
    ...state,
    attributeBufferValues: objectMap(state.attributeBufferValues, propValue => {
      const binding = getAttributeBufferBinding(propValue.optionId);
      return {
        ...propValue,
        ...(binding
          ? { value: binding.getValue(state.meshId), error: "" }
          : {
              error: validateAttributeBuffer(propValue.value, propValue.type),
            }),
      };
    }),
  };
};

const applyIndexBufferBindingsReducer = (state: ViewerState): ViewerState => {
  const indexBufferValue = state.indexBufferValue;
  const binding = getIndexBufferBinding(indexBufferValue.optionId);

  return {
    ...state,
    indexBufferValue: {
      ...state.indexBufferValue,
      ...(binding
        ? { value: binding.getValue(state.meshId), error: "" }
        : {
            error: validateIndexBuffer(state.indexBufferValue.value),
          }),
    },
  };
};

const applyUniformBindingsReducer = (state: ViewerState): ViewerState => {
  return {
    ...state,
    uniformValues: objectMap(state.uniformValues, propValue => ({
      ...propValue,
      value:
        getUniformBinding(propValue.optionId)?.getValue(state.cameraPosition, state.viewerSize) ??
        propValue.value,
    })),
  };
};

export const reducer = compose(
  applyIndexBufferBindingsReducer,
  applyAttributeBufferBindingsReducer,
  applyUniformBindingsReducer,
  mainReducer
);
