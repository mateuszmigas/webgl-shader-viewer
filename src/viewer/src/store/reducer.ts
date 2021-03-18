import { getExtensionState } from "../../../common/extensionState";
import { ViewerAction } from "./actions";
import { ViewerState } from "./state";
import { attributeBufferBindings } from "../components/attributeBuffers/attributeBufferBindings";
import { objectMap } from "../utils/object";

const initialState: ViewerState = {
  ...getExtensionState(),
  counter: 0,
};

export const reducer = (state: ViewerState = initialState, action: ViewerAction): ViewerState => {
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
      //const bindingNames.has(optionId)

      return {
        ...state,
        uniformValues: {
          ...state.uniformValues,
          [name]: { ...state.uniformValues[name], ...rest },
        },
      };
    }
    case "SET_ATTRIBUTE_BUFFER": {
      const { name, ...rest } = action.payload;
      return {
        ...state,
        attributeBufferValues: {
          ...state.attributeBufferValues,
          [name]: {
            ...state.attributeBufferValues[name],
            ...rest,
            value: attributeBufferBindings.get(rest.optionId)?.getValue(state.meshId) ?? rest.value,
          },
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
    case "SET_CAMERA_POSITION": {
      return {
        ...state,
      };
    }
    case "SET_MESH": {
      return {
        ...state,
        attributeBufferValues: objectMap(state.attributeBufferValues, propValue => {
          return {
            ...propValue,
            value:
              attributeBufferBindings.get(propValue.optionId)?.getValue(action.payload.id) ??
              propValue.value,
          };
        }),
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
