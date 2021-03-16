import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "../../store/actions";
import { ViewerState } from "../../store/state";
import { translations } from "../../translations";
import { AttributeBufferType } from "../../utils/webgl/attributeBuffer";
import { getByName } from "../../utils/webgl/attributeBufferComponent";
import {
  Vector2NumberInput,
  Vector3NumberInput,
  Vector4NumberInput,
  Matrix4x4NumberInput,
} from "../common";
import { customOption } from "../common/constants";
import { Dropdown } from "../Dropdown";
import { bindingNames, getBindingOptions, getBindingValue } from "./attributeBufferBindings";
import { getDefaultProps } from "./attributeBufferUtils";

type OwnProps = {
  name: string;
  type: AttributeBufferType;
};

const renderAttributeBufferInput = (
  type: AttributeBufferType,
  props: {
    value: any;
    onChange: (newValue: any) => void;
    readonly: boolean;
  }
) => {
  switch (type) {
    case AttributeBufferType.FLOAT_VEC2:
      return <Vector2NumberInput {...props}></Vector2NumberInput>;
    case AttributeBufferType.FLOAT_VEC3:
      return <Vector3NumberInput {...props}></Vector3NumberInput>;
    case AttributeBufferType.FLOAT_VEC4:
      return <Vector4NumberInput {...props}></Vector4NumberInput>;
    default:
      return <div>Uniform not supported</div>;
  }
};

{
  /* <input
                value={values[abf.name]?.value}
                onChange={e => {
                  //getfrom cache and update
                  setValue(abf.name, abf.type, "", e.target.value);
                  const weblg = getByName(abf.name, abf.type);

                  if (weblg) {
                    weblg.attributeBufferInfo.setValue(JSON.parse(e.target.value));
                  } else {
                    console.log("ab not found");
                  }
                }}
                //onBlur
              ></input> */
}

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  const attibuteBufferValue = state.attributeBufferValues[ownProps.name];
  return attibuteBufferValue?.type === ownProps.type
    ? attibuteBufferValue
    : getDefaultProps(ownProps.type);
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setOptionAndValue: (optionId: string, value: string) => {
      dispatch({
        type: "SET_ATTRIBUTE_BUFFER",
        payload: {
          ...ownProps,
          optionId,
          value: bindingNames.has(optionId) ? getBindingValue(optionId, ownProps.type) : value,
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
      value: any;
      setOptionAndValue: (optionId: string, value: string) => void;
    }) => {
      const { type, optionId, value, setOptionAndValue } = props;
      const options = React.useMemo(() => [customOption, ...getBindingOptions(type)], [type]);
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
          {renderAttributeBufferInput(type, {
            value,
            onChange: isCustom ? newValue => setOptionAndValue(optionId, newValue) : undefined,
            readonly: !isCustom,
          })}
        </div>
      );
    }
  )
);
