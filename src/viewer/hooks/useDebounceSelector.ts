import { debounce } from "@utils/function";
import React from "react";
import { Store } from "redux";
import { useForceRender } from "./useForceRender";

const referenceCompare = <TSelected>(left: TSelected, right: TSelected) => left === right;

export const createUseDebounceSelector = <TState>(store: Store<TState, any>) => <TSelected>(
  selector: (state: TState) => TSelected,
  shouldDebounce: (oldState: TSelected, newState: TSelected) => boolean,
  waitMs: number,
  equalityFn?: (oldState: TSelected, newState: TSelected) => boolean
) => {
  const forceRender = useForceRender();
  const areEqual = equalityFn ?? referenceCompare;
  const state = React.useRef(selector(store.getState()));
  const setState = React.useCallback(
    (newValue: TSelected) => {
      state.current = newValue;
      forceRender();
    },
    [forceRender]
  );
  const debounceSetState = React.useMemo(() => debounce(setState, waitMs), []);

  React.useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newValue = selector(store.getState());

      //todo fix other way
      if (!!newValue && !areEqual(state.current, newValue)) {
        if (shouldDebounce(state.current, newValue)) {
          debounceSetState(newValue);
        } else {
          debounceSetState.cancel();
          setState(newValue);
        }
      }
    });

    return () => {
      debounceSetState.cancel();
      unsubscribe();
    };
  }, [areEqual, debounceSetState, selector, setState, shouldDebounce]);

  return state.current;
};
