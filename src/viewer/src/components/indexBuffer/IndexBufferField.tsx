import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { ViewerAction } from "../../store/actions";
import { ViewerState } from "../../store/state";
import { ArrayNumberInput } from "../common/ArrayNumberInput";
import { customOption } from "../common/constants";
import { Dropdown } from "../Dropdown";
import { SectionField } from "../SectionField";
import { getBindingOptions } from "./indexBufferBindings";

type FieldState = { optionId: string; value: string; isValid: boolean };
const options = [customOption, ...getBindingOptions()];

const mapStateToProps = (state: ViewerState) => {
  return {
    state: state.indexBufferValue,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setState: (newState: FieldState) =>
      dispatch({ type: "SET_INDEX_BUFFER", payload: { ...newState } }),
  };
};

export const IndexBufferField = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )((props: { state: FieldState; setState: (state: FieldState) => void }) => {
    const { state, setState } = props;
    const isCustom = state.optionId === customOption.id;

    return (
      <SectionField text={"Indices"}>
        <Dropdown
          selectedItemId={state.optionId}
          onChange={selectedItemId => setState({ ...state, optionId: selectedItemId })}
          options={options}
        ></Dropdown>
        <ArrayNumberInput
          value={state.value}
          onChange={(value, isValid) => setState({ ...state, value, isValid })}
          elementSize={1}
          readonly={!isCustom}
        ></ArrayNumberInput>
      </SectionField>
    );
  })
);
