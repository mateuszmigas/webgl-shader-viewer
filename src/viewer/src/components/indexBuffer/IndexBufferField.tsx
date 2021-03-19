import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { ViewerAction } from "../../store/actions";
import { ViewerState } from "../../store/state";
import { ArrayNumberInput } from "../common/ArrayNumberInput";
import { customOption } from "../common/constants";
import { Dropdown } from "../Dropdown";
import { SectionField } from "../SectionField";
import { getBindingOptions } from "./indexBufferBindings";

const options = [customOption, ...getBindingOptions()];

const mapStateToProps = (state: ViewerState) => {
  return {
    ...state.indexBufferValue,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setOption: (optionId: string) => {
      return dispatch({
        type: "SET_INDEX_BUFFER_OPTION",
        payload: {
          optionId,
        },
      });
    },
    setValue: (value: string) => {
      return dispatch({
        type: "SET_INDEX_BUFFER_VALUE",
        payload: {
          value,
        },
      });
    },
  };
};

export const IndexBufferField = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      optionId: string;
      value: string;
      error: string;
      setOption: (optionId: string) => void;
      setValue: (value: string) => void;
    }) => {
      const { optionId, value, error, setOption, setValue } = props;
      const isCustom = optionId === customOption.id;

      return (
        <SectionField text={"Indices"}>
          <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
          <ArrayNumberInput
            value={value}
            onChange={setValue}
            error={error}
            readonly={!isCustom}
          ></ArrayNumberInput>
        </SectionField>
      );
    }
  )
);
