import { debounce } from "@utils/function";
import React from "react";
import { Store } from "redux";

const referenceCompare = <TSelected>(left: TSelected, right: TSelected) => left === right;

export const createUseViewerDebounceSelector = <TState>(store: Store<TState, any>) => <TSelected>(
  selector: (state: TState) => TSelected,
  shouldDebounce: (oldState: TSelected, newState: TSelected) => boolean,
  waitMs: number,
  equalityFn?: (oldState: TSelected, newState: TSelected) => boolean
) => {
  const areEqual = equalityFn ?? referenceCompare;
  const [selectedState, setSelectedState] = React.useState(selector(store.getState()));
  const debounceSetState = React.useMemo(
    () => debounce((slice: TSelected) => setSelectedState(slice), waitMs),
    []
  );

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newValue = selector(store.getState());

      if (!areEqual(selectedState, newValue)) {
        if (shouldDebounce(selectedState, newValue)) {
          debounceSetState(newValue);
        } else {
          debounceSetState.cancel();
          setSelectedState(newValue);
        }
      }
    });

    return () => {
      debounceSetState.cancel();
      unsubscribe();
    };
  }, []);

  return selectedState;
};
