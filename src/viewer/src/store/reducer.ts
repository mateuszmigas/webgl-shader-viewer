import { getViewerState } from "../../../common/state";
import { ViewerAction } from "./actions";
import { ViewerState } from "./state";

const vsCodeState = getViewerState();

const initialState: ViewerState = {
  vertexFilePath: vsCodeState.vertexFilePath,
  counter: 0,
};

export const reducer = (
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
    case "UPADTE_COUNTER": {
      return {
        ...state,
        counter: action.payload.value,
      };
    }
    default: {
      return state;
    }
  }
};
