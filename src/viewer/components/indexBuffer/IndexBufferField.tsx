import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { ViewerAction } from "@viewerStore/actions";
import { ViewerState } from "@viewerStore/state";
import { TextInput } from "../common/TextInput";
import { customOption } from "@common/constants";
import { Dropdown } from "../common/Dropdown";
import { SectionField } from "../common/SectionField";
import { translations } from "@common/translations";
import { getIndexBufferBindingOptions } from "@utils/webgl/indexBuffer/indexBufferUtils";

const options = [customOption, ...getIndexBufferBindingOptions()];

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

export const IndexBufferField = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  React.memo(
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
        <SectionField text={translations.indices.title}>
          <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
          <TextInput
            value={value}
            onChange={setValue}
            error={error}
            readonly={!isCustom}
          ></TextInput>
        </SectionField>
      );
    }
  )
);
