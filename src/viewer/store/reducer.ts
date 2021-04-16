import { customOption } from "@common/constants";
import { IndexBufferState, TextureState, UniformState } from "./../../extensionState";
import { validateIndexBuffer } from "./../validation/indexBufferValidator";
import { AttributeBufferState } from "@extensionState";
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

const uniformReducer = (state: UniformState, action: ViewerAction): UniformState => {
  switch (action.type) {
    case "SET_UNIFORM_VALUE":
    case "SET_UNIFORM_OPTION": {
      const { name, ...rest } = action.payload;
      return {
        ...state,
        ...rest,
      };
    }
    default:
      return state;
  }
};

const attributeBufferReducer = (
  state: AttributeBufferState,
  action: ViewerAction
): AttributeBufferState => {
  switch (action.type) {
    case "SET_ATTRIBUTE_BUFFER_VALUE":
    case "SET_ATTRIBUTE_BUFFER_OPTION": {
      const { name, ...rest } = action.payload;
      const newState = {
        ...state,
        ...rest,
      };
      newState.error =
        newState.optionId === customOption.id ? validateAttributeBuffer(newState.value) : "";

      return newState;
    }
    default:
      return state;
  }
};

const indexBufferReducer = (state: IndexBufferState, action: ViewerAction): IndexBufferState => {
  switch (action.type) {
    case "SET_INDEX_BUFFER_VALUE":
    case "SET_INDEX_BUFFER_OPTION": {
      const newState = {
        ...state,
        ...action.payload,
      };
      newState.error =
        newState.optionId === customOption.id ? validateIndexBuffer(newState.value) : "";

      return newState;
    }
    default:
      return state;
  }
};

const textureReducer = (state: TextureState, action: ViewerAction): TextureState => {
  switch (action.type) {
    case "SET_TEXTURE_WORKSPACE_URL":
    case "SET_TEXTURE_CUSTOM_URL":
    case "SET_TEXTURE_LOADING_ERROR":
    case "SET_TEXTURE_OPTION": {
      const { name, ...rest } = action.payload;
      return {
        ...state,
        ...rest,
      };
    }
    default:
      return state;
  }
};

const mainReducer = (state: ViewerState, action: ViewerAction): ViewerState => {
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
    case "SET_UNIFORM_VALUE":
    case "SET_UNIFORM_OPTION": {
      const { name } = action.payload;
      const current = state.uniformValues[name];

      return {
        ...state,
        uniformValues: {
          ...state.uniformValues,
          [name]: uniformReducer(current, action),
        },
      };
    }
    case "SET_ATTRIBUTE_BUFFER_VALUE":
    case "SET_ATTRIBUTE_BUFFER_OPTION": {
      const { name } = action.payload;
      const current = state.attributeBufferValues[name];
      return {
        ...state,
        attributeBufferValues: {
          ...state.attributeBufferValues,
          [name]: attributeBufferReducer(current, action),
        },
      };
    }
    case "SET_INDEX_BUFFER_VALUE":
    case "SET_INDEX_BUFFER_OPTION": {
      return {
        ...state,
        indexBufferValue: indexBufferReducer(state.indexBufferValue, action),
      };
    }
    case "SET_TEXTURE_WORKSPACE_URL":
    case "SET_TEXTURE_CUSTOM_URL":
    case "SET_TEXTURE_LOADING_ERROR":
    case "SET_TEXTURE_OPTION": {
      const { name } = action.payload;
      const current = state.textureValues[name];
      return {
        ...state,
        textureValues: {
          ...state.textureValues,
          [name]: textureReducer(current, action),
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
    case "SET_WORKSPACE_IMAGE_OPTIONS": {
      return {
        ...state,
        userWorkspace: {
          ...state.userWorkspace,
          imageOptions: action.payload.options,
        },
      };
    }
    case "SET_WORKSPACE_SHADER_OPTIONS": {
      return {
        ...state,
        userWorkspace: {
          ...state.userWorkspace,
          shaderOptions: action.payload.options,
        },
      };
    }
    default: {
      return state;
    }
  }
};

//meshId
const applyAttributeBufferBindingsReducer = (state: ViewerState): ViewerState => {
  return {
    ...state,
    attributeBufferValues: objectMap(state.attributeBufferValues, propValue => {
      const binding = getAttributeBufferBinding(propValue.optionId);
      return binding
        ? {
            ...propValue,
            value: binding.getValue(state.meshId),
          }
        : propValue;
    }),
  };
};

//meshId
const applyIndexBufferBindingsReducer = (state: ViewerState): ViewerState => {
  const indexBufferValue = state.indexBufferValue;
  const binding = getIndexBufferBinding(indexBufferValue.optionId);

  return binding
    ? {
        ...state,
        indexBufferValue: {
          ...state.indexBufferValue,
          value: binding.getValue(state.meshId),
        },
      }
    : state;
};

//optionId, camera
const applyUniformBindingsReducer = (state: ViewerState): ViewerState => {
  return {
    ...state,
    uniformValues: objectMap(state.uniformValues, propValue => {
      const binding = getUniformBinding(propValue.optionId);

      return binding
        ? {
            ...propValue,
            value: binding.getValue(state.cameraPosition, state.viewerSize),
          }
        : propValue;
    }),
  };
};

export const reducer = compose(
  applyIndexBufferBindingsReducer,
  applyAttributeBufferBindingsReducer,
  applyUniformBindingsReducer,
  mainReducer
);
