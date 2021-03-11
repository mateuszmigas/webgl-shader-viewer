import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import { translations } from "../translations";
import { AttributeBufferType } from "../utils/webgl/attributeBuffer";
import { SectionField } from "./SectionField";
import { SectionTitle } from "./SectionTitle";

const mapStateToProps = (state: ViewerState) => {
  return {
    values: state.attributeBufferValues,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setValue: (name: string, type: number, value: string) =>
      dispatch({ type: "SET_ATTRIBUTE_BUFFER", payload: { name, type, value } }),
  };
};

export type AttributeBufferFieldInfo = { name: string; type: AttributeBufferType };

export const AttributeBufferSection = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      attributeBufferFields: AttributeBufferFieldInfo[];
      values: { [key: string]: { type: number; value: any } };
      setValue: (name: string, type: number, value: string) => void;
    }) => {
      const { attributeBufferFields, values, setValue } = props;

      return (
        <div className="viewer-options-section">
          <SectionTitle text={translations.attributeBuffers}></SectionTitle>
          {attributeBufferFields.map(abi => {
            return (
              <SectionField text={abi.name}>
                <input
                  value={values[abi.name]?.value}
                  onChange={e => {
                    //getfrom cache and update
                    setValue(abi.name, 2, e.target.value);
                  }}
                  //onBlur
                ></input>
              </SectionField>
            );
          })}
        </div>
      );
    }
  )
);
