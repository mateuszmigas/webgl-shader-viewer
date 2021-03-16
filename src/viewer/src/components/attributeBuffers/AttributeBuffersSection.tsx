import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "../../store/state";
import { translations } from "../../translations";
import { AttributeBufferType } from "../../utils/webgl/attributeBuffer";
import { SectionField } from "../SectionField";
import { SectionTitle } from "../SectionTitle";
import { AttributeBufferField } from "./AttributeBufferField";

const mapStateToProps = (state: ViewerState) => {
  return {
    values: state.attributeBufferValues,
  };
};

export type AttributeBufferFieldInfo = { name: string; type: AttributeBufferType };

export const AttributeBuffersSection = React.memo(
  connect(mapStateToProps)((props: { attributeBufferFields: AttributeBufferFieldInfo[] }) => {
    const { attributeBufferFields } = props;

    return (
      <div className="viewer-options-section">
        <SectionTitle text={translations.attributeBuffers}></SectionTitle>
        {attributeBufferFields.map(abf => (
          <SectionField text={abf.name}>
            <AttributeBufferField {...abf}></AttributeBufferField>
          </SectionField>
        ))}
      </div>
    );
  })
);
