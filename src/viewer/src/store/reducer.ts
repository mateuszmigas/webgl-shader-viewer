import { indexBufferBindings } from "./../components/indexBuffer/indexBufferBindings";
import { uniformBindings } from "../components/uniform/uniformBindings";
import { getExtensionState } from "../../../common/extensionState";
import { ViewerAction } from "./actions";
import { ViewerState } from "./state";
import { attributeBufferBindings } from "../components/attributeBuffer/attributeBufferBindings";
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
    case "SET_ATTRIBUTE_BUFFER": {
      const { name, ...rest } = action.payload;

      const updated = {
        ...state,
        attributeBufferValues: {
          ...state.attributeBufferValues,
          [name]: {
            ...state.attributeBufferValues[name],
            ...rest,
            //value: attributeBufferBindings.get(rest.optionId)?.getValue(state.meshId) ?? rest.value,
          },
        },
      };
      //console.log("updated", updated);

      return updated;
    }
    case "SET_INDEX_BUFFER": {
      return {
        ...state,
        indexBufferValue: { ...action.payload },
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
    // case "SET_CAMERA_POSITION": {
    //   return {
    //     ...state,
    //     uniformValues: objectMap(state.uniformValues, propValue => {
    //       return {
    //         ...propValue,
    //         value:
    //           uniformBindings
    //             .get(propValue.optionId)
    //             ?.getValue(action.payload.position, state.viewerSize) ?? propValue.value,
    //       };
    //     }),
    //     cameraPosition: action.payload.position,
    //   };
    // }
    // case "SET_MESH": {
    //   const indexBufferValue = state.indexBufferValue;
    //   return {
    //     ...state,
    //     // attributeBufferValues: objectMap(state.attributeBufferValues, propValue => {
    //     //   return {
    //     //     ...propValue,
    //     //     value:
    //     //       attributeBufferBindings.get(propValue.optionId)?.getValue(action.payload.id) ??
    //     //       propValue.value,
    //     //   };
    //     // }),
    //     indexBufferValue: {
    //       ...indexBufferValue,
    //       value:
    //         indexBufferBindings.get(indexBufferValue.optionId)?.getValue(action.payload.id) ??
    //         indexBufferValue.value,
    //     },
    //     meshId: action.payload.id,
    //   };
    // }
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
