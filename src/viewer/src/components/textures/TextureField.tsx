import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { ViewerAction } from "../../store/actions";
import { ViewerState } from "../../store/state";
import { customOption } from "../common/constants";
import { Dropdown } from "../Dropdown";
import { getBindingOptions } from "./textureBindings";

type OwnProps = {
  name: string;
};

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  const textureValue = state.textureValues[ownProps.name];
  return textureValue; // ?? : getDefaultProps(ownProps.type);
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setOptionAndValue: (optionId: string, value: string) => {},
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
      value: any;
      setOptionAndValue: (optionId: string, value: string) => void;
    }) => {
      const { optionId, value, setOptionAndValue } = props;
      const options = React.useMemo(() => [customOption, ...getBindingOptions()], []);
      const isCustom = optionId === customOption.id;

      return (
        <div>
          {options.length > 1 && (
            <Dropdown
              selectedItemId={optionId}
              onChange={optionId => setOptionAndValue(optionId, value)}
              options={options}
            ></Dropdown>
          )}
          <div>dupa</div>
        </div>
      );
    }
  )
);
