import { ExtensionState, getExtensionState, setExtensionState } from "@extensionState";
import { debounce } from "@utils/function";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createStore, Store } from "redux";
import { createUseDebounceSelector } from "viewer/hooks/useDebounceSelector";
import { ViewerAction } from "./actions";
import { reducer } from "./reducer";
import { ViewerState } from "./state";
export { ViewerState } from "./state";

export const initialState: ViewerState = {
  ...getExtensionState(),
  viewerSize: { width: 1, height: 1 },
  userWorkspace: {
    imageOptions: [],
    shaderOptions: [],
  },
};

export const store: Store<ViewerState, ViewerAction> = createStore(reducer, initialState);
export type ViewerDispatch = typeof store.dispatch;
export const useViewerDispatch = () => useDispatch<ViewerDispatch>();
export const useViewerSelector: TypedUseSelectorHook<ViewerState> = useSelector;
export const useViewerDebounceSelector = createUseDebounceSelector<ViewerState>(store);

const storeExtensionState = debounce((extensionState: ExtensionState) => {
  setExtensionState(extensionState);
}, 500);

store.subscribe(() => {
  const currentState = store.getState();
  storeExtensionState(currentState);
});
