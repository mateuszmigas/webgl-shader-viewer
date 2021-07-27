import React from "react";
import {
  useFocusOnStateChange,
  useDropdownCloseWhenClickedOutside,
  useDropdownState,
  useAdjustVerticalOffsetWhenOutsideViewport,
  VirtualizedList,
  DropdownDispatch,
  DropdownActions,
  createListKeyboardNavigator,
} from "@mateuszmigas/react-dropdown";

export type DropdownOption = {
  id: string;
  display: string;
};

export const Dropdown = React.memo(
  (props: {
    selectedItemId: string | null;
    onChange: (newSelectedItemId: string) => void;
    options: DropdownOption[];
  }) => {
    const { selectedItemId, onChange, options } = props;
    const maxHeight = 125;
    const itemHeight = 25;
    const height = Math.min(options.length * itemHeight, maxHeight);

    const [state, dispatch] = useDropdownState(
      options.length,
      { selectedIndexes: [] },
      {},
      changes => {
        if (changes.selectedIndexes !== undefined) {
          onChange(
            changes.selectedIndexes.length > 0
              ? options[changes.selectedIndexes[0]].id
              : null
          );
        }
      }
    );

    const foundIndex = options.findIndex(i => i.id === selectedItemId);
    const selectedIndex = foundIndex >= 0 ? foundIndex : null;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    useDropdownCloseWhenClickedOutside(containerRef, dispatch);
    useFocusOnStateChange(listRef, state.isOpen, true);
    const { top } = useAdjustVerticalOffsetWhenOutsideViewport(
      containerRef,
      height
    );

    const listKeyboardHandler = React.useMemo(() => {
      const defaultHandler = createListKeyboardNavigator(dispatch);
      return (e: React.KeyboardEvent<Element>) => {
        switch (e.key) {
          case "Enter":
            e.preventDefault();
            return defaultHandler(e);
          default:
            defaultHandler(e);
        }
      };
    }, [dispatch]);

    return (
      <div ref={containerRef} className="dropdown-container">
        <DropdownMain
          {...state}
          dispatch={dispatch}
          itemRenderer={() => (
            <div>
              {selectedIndex !== null ? options[selectedIndex].display : ""}
            </div>
          )}
        ></DropdownMain>
        {state.isOpen && (
          <div
            className="dropdown-list"
            style={{ top }}
            onKeyDown={listKeyboardHandler}
            ref={listRef}
            tabIndex={0}
          >
            <VirtualizedList
              itemCount={options.length}
              itemHeight={itemHeight}
              highlightedIndex={state.highlightedIndex}
              maxHeight={maxHeight}
              itemRenderer={index => (
                <DropdownItem
                  text={options[index].display}
                  index={index}
                  isSelected={selectedIndex === index}
                  isHighlighted={state.highlightedIndex === index}
                  dispatch={dispatch}
                ></DropdownItem>
              )}
            ></VirtualizedList>
          </div>
        )}
      </div>
    );
  }
);

const DropdownMain = (props: {
  isOpen: boolean;
  itemRenderer: () => JSX.Element;
  dispatch: DropdownDispatch<DropdownActions>;
}) => {
  const { isOpen, itemRenderer, dispatch } = props;
  const dropdownSelectRef = React.useRef(null);
  const handleSelect = React.useCallback(
    () => dispatch([isOpen ? "CloseList" : "OpenList"]),
    [isOpen, dispatch]
  );

  useFocusOnStateChange(dropdownSelectRef, isOpen, false);

  return (
    <div className="dropdown-main">
      <button
        ref={dropdownSelectRef}
        className={`dropdown-select ${isOpen ? "dropdown-select-open" : ""}`}
        onClick={handleSelect}
      >
        {itemRenderer()}
        {"▼"}
      </button>
    </div>
  );
};

const DropdownItem = (props: {
  text: string | null;
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  dispatch: DropdownDispatch<DropdownActions>;
}) => {
  const { text, index, isSelected, isHighlighted, dispatch } = props;
  const style = `dropdown-list-item ${
    isSelected ? "dropdown-list-item-selected" : ""
  }  ${isHighlighted ? "dropdown-list-item-highlighted" : ""}`;

  return (
    <div
      key={index}
      onClick={() => dispatch([{ type: "SelectIndex", index }, "CloseList"])}
      className={style}
    >
      <div className="dropdown-list-item-text">{text}</div>
    </div>
  );
};
