import { validateIndexBuffer } from "./../validation/indexBufferValidator";
import { indexBufferBindings } from "./../components/indexBuffer/indexBufferBindings";
import { uniformBindings } from "../components/uniform/uniformBindings";
import { getExtensionState } from "../../../common/extensionState";
import { ViewerAction } from "./actions";
import { ViewerState } from "./state";
import { attributeBufferBindings } from "../components/attributeBuffer/attributeBufferBindings";
import { objectMap } from "../utils/object";
import { validateAttributeBuffer } from "../validation/attributeBufferValidator";

const initialState: ViewerState = {
  ...getExtensionState(),
  counter: 0,
};

export const mainReducer = (
  state: ViewerState = initialState,
  action: ViewerAction
): ViewerState => {
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
    case "SET_UNIFORM": {
      const { name, ...rest } = action.payload;
      return {
        ...state,
        uniformValues: {
          ...state.uniformValues,
          [name]: {
            ...state.uniformValues[name],
            ...rest,
            value:
              uniformBindings
                .get(rest.optionId)
                ?.getValue(state.cameraPosition, state.viewerSize) ?? rest.value,
          },
        },
      };
    }
    case "SET_ATTRIBUTE_BUFFER_OPTION": {
      console.log("setting opt", action.payload);
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
      const binding = indexBufferBindings.get(optionId);
      return {
        ...state,
        indexBufferValue: {
          ...state.indexBufferValue,
          optionId,
          ...(binding
            ? { value: binding.getValue(state.meshId), error: "" }
            : { error: validateIndexBuffer(state.indexBufferValue.value) }),
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
          error: validateIndexBuffer(value),
        },
      };
    }
    case "SET_TEXTURE": {
      const { name, ...rest } = action.payload;

      return {
        ...state,
        textureValues: {
          ...state.textureValues,
          [name]: { ...state.textureValues[name], ...rest },
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
      const indexBufferValue = state.indexBufferValue;
      const indexBufferBinding = indexBufferBindings.get(indexBufferValue.optionId);

      return {
        ...state,
        indexBufferValue: {
          ...indexBufferValue,
          ...(indexBufferBinding
            ? { value: indexBufferBinding.getValue(action.payload.id), error: "" }
            : {}),
        },
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

export const applyAttributeBuffersReducer = (state: ViewerState): ViewerState => {
  return {
    ...state,
    attributeBufferValues: objectMap(state.attributeBufferValues, propValue => {
      const binding = attributeBufferBindings.get(propValue.optionId);
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

export const applyUniformsReducer = (state: ViewerState): ViewerState => {
  return {
    ...state,
    uniformValues: objectMap(state.uniformValues, propValue => ({
      ...propValue,
      value:
        uniformBindings.get(propValue.optionId)?.getValue(state.cameraPosition, state.viewerSize) ??
        propValue.value,
    })),
  };
};
