import { getExtensionState } from "../../../common/extensionState";
import { ViewerAction } from "./actions";
import { ViewerState } from "./state";

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
          [name]: { ...state.attributeBufferValues[name], ...rest },
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
