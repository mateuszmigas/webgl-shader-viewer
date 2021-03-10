import React from "react";
import {
  useFocusOnStateChange,
  useDropdownCloseWhenClickedOutside,
  useDropdownListKeyboardNavigator,
  useDropdownState,
  VirtualizedList,
  DropdownDispatch,
  DropdownActions,
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

    const [state, dispatch] = useDropdownState(
      options.length,
      { selectedIndexes: [] },
      {},
      changes => {
        if (changes.selectedIndexes !== undefined) {
          onChange(
            changes.selectedIndexes.length > 0 ? options[changes.selectedIndexes[0]].id : null
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

    const listKeyboardHandler = useDropdownListKeyboardNavigator(dispatch);

    return (
      <div ref={containerRef} className="dropdown-container">
        <DropdownMain
          {...state}
          dispatch={dispatch}
          showClearButton={false}
          itemRenderer={() => (
            <div>{selectedIndex !== null ? options[selectedIndex].display : ""}</div>
          )}
        ></DropdownMain>
        {state.isOpen && (
          <div className="dropdown-list" onKeyDown={listKeyboardHandler} ref={listRef} tabIndex={0}>
            <VirtualizedList
              itemCount={options.length}
              itemHeight={25}
              highlightedIndex={state.highlightedIndex}
              maxHeight={200}
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
  showClearButton?: boolean;
}) => {
  const { isOpen, itemRenderer, showClearButton = true, dispatch } = props;
  const dropdownSelectRef = React.useRef(null);
  const handleSelect = React.useCallback(() => dispatch([isOpen ? "CloseList" : "OpenList"]), [
    isOpen,
    dispatch,
  ]);
  const handleClear = React.useCallback(() => dispatch(["ClearSelection"]), [dispatch]);

  useFocusOnStateChange(dropdownSelectRef, isOpen, false);

  return (
    <div className="dropdown-main">
      <button ref={dropdownSelectRef} className="dropdown-select" onClick={handleSelect}>
        {itemRenderer()}
        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"}`}></i>
      </button>
      {showClearButton && (
        <button className="dropdown-clear" onClick={handleClear}>
          <i className="fa fa-times"></i>
        </button>
      )}
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
  const style = `dropdown-list-item ${isSelected ? "selected" : ""}  ${
    isHighlighted ? "highlighted" : ""
  }`;

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
