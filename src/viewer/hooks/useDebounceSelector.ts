import { debounce } from "@utils/function";
import React from "react";
import { Store } from "redux";

const referenceCompare = <TSelected>(left: TSelected, right: TSelected) => left === right;

export const useForceRender = () => {
  const [, forceRender] = React.useReducer(s => s + 1, 0);
  return forceRender;
};

export const createUseViewerDebounceSelector = <TState>(store: Store<TState, any>) => <TSelected>(
  selector: (state: TState) => TSelected,
  shouldDebounce: (oldState: TSelected, newState: TSelected) => boolean,
  waitMs: number,
  equalityFn?: (oldState: TSelected, newState: TSelected) => boolean
) => {
  const [, forceRender] = React.useReducer(s => s + 1, 0);
  const areEqual = equalityFn ?? referenceCompare;
  const selectedState = React.useRef(selector(store.getState()));
  const debounceSetState = React.useMemo(
    () =>
      debounce((newValue: TSelected) => {
        selectedState.current = newValue;
        forceRender();
      }, waitMs),
    []
  );

  React.useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newValue = selector(store.getState());

      if (!areEqual(selectedState.current, newValue)) {
        if (shouldDebounce(selectedState.current, newValue)) {
          debounceSetState(newValue);
        } else {
          debounceSetState.cancel();
          selectedState.current = newValue;
          forceRender();
        }
      }
    });

    return () => {
      debounceSetState.cancel();
      unsubscribe();
    };
  }, []);

  return selectedState.current;
};
