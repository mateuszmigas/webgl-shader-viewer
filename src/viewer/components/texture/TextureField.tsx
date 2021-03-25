import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { ViewerAction } from "@viewerStore/actions";
import { ViewerState } from "@viewerStore/state";
import { customOption } from "@common/constants";
import { TextInput } from "../common/TextInput";
import { Dropdown } from "../common/Dropdown";
import { getBindingOptions } from "./textureBindings";
import { getDefaultProps } from "./texturesUtils";

type OwnProps = {
  name: string;
};

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  const textureValue = state.textureValues[ownProps.name];
  return textureValue ?? getDefaultProps();
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setOption: (optionId: string) => {
      return dispatch({
        type: "SET_TEXTURE_OPTION",
        payload: {
          ...ownProps,
          optionId,
        },
      });
    },
    setValue: (value: string) => {
      return dispatch({
        type: "SET_TEXTURE_VALUE",
        payload: {
          ...ownProps,
          value,
        },
      });
    },
  };
};

export const TextureField = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      name: string;
      optionId: string;
      value: string;
      error: string;
      setOption: (optionId: string) => void;
      setValue: (value: string) => void;
    }) => {
      const { optionId, value, error, setOption, setValue } = props;
      const options = React.useMemo(
        () => [{ id: customOption.id, display: "Custom URL" }, ...getBindingOptions()],
        []
      );
      const isCustom = optionId === customOption.id;

      return (
        <div>
          {options.length > 1 && (
            <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
          )}
          {isCustom && <TextInput value={value} error={error} onChange={setValue}></TextInput>}
        </div>
      );
    }
  )
);