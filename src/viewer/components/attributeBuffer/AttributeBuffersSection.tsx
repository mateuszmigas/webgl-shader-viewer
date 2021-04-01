import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { AttributeBufferField } from "./AttributeBufferField";

const mapStateToProps = (state: ViewerState) => {
  return {
    attributeBufferValues: state.attributeBufferValues,
  };
};

export const AttributeBuffersSection = connect(mapStateToProps)(
  React.memo(
    ({
      attributeBufferValues,
    }: {
      attributeBufferValues: ViewerState["attributeBufferValues"];
    }) => {
      return Object.keys(attributeBufferValues).length ? (
        <div className="viewer-options-section">
          <SectionTitle text={translations.attributeBuffers}></SectionTitle>
          {Object.entries(attributeBufferValues).map(([name, value]) => (
            <SectionField key={name} text={name}>
              <AttributeBufferField name={name} {...value}></AttributeBufferField>
            </SectionField>
          ))}
        </div>
      ) : null;
    }
  )
);
