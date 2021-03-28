import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "@viewerStore/actions";
import { ViewerState } from "@viewerStore/state";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer/attributeBuffer";
import { TextInput } from "../common/TextInput";
import { customOption } from "@common/constants";
import { Dropdown } from "../common/Dropdown";
import { getAttributeBufferBindingOptionsForType } from "@utils/webgl/attributeBuffer/attributeBufferUtils";

type OwnProps = {
  name: string;
  type: AttributeBufferType;
};

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  return {
    ...state.attributeBufferValues[ownProps.name],
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setOption: (optionId: string) => {
      return dispatch({
        type: "SET_ATTRIBUTE_BUFFER_OPTION",
        payload: {
          ...ownProps,
          optionId,
        },
      });
    },
    setValue: (value: string) => {
      return dispatch({
        type: "SET_ATTRIBUTE_BUFFER_VALUE",
        payload: {
          ...ownProps,
          value,
        },
      });
    },
  };
};

export const AttributeBufferField = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      name: string;
      type: number;
      optionId: string;
      value: string;
      error: string;
      setOption: (optionId: string) => void;
      setValue: (value: string) => void;
    }) => {
      const { type, value, optionId, error, setOption, setValue } = props;
      const options = [customOption, ...getAttributeBufferBindingOptionsForType(type)];
      const isCustom = optionId === customOption.id;

      return (
        <div>
          {options.length > 1 && (
            <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
          )}
          <TextInput
            value={value}
            onChange={setValue}
            error={error}
            readonly={!isCustom}
          ></TextInput>
        </div>
      );
    }
  )
);
