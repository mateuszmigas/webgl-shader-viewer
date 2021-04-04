import React from "react";
import { connect, shallowEqual } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { AttributeBufferField } from "./AttributeBufferField";
import { objectMap } from "@utils/object";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer/attributeBuffer";

const mapStateToProps = (state: ViewerState) => {
  return {
    attributeBuffers: objectMap(state.attributeBufferValues, propValue => propValue.type),
  };
};

export const AttributeBuffersSection = connect(mapStateToProps, null, null, {
  areStatePropsEqual: (o, n) => shallowEqual(o.attributeBuffers, n.attributeBuffers),
})(
  React.memo(
    ({ attributeBuffers }: { attributeBuffers: { [key: string]: AttributeBufferType } }) => {
      return Object.keys(attributeBuffers).length ? (
        <div className="viewer-options-section">
          <SectionTitle text={translations.attributeBuffers}></SectionTitle>
          {Object.entries(attributeBuffers).map(([name, type]) => (
            <SectionField key={name} text={name}>
              <AttributeBufferField name={name} type={type}></AttributeBufferField>
            </SectionField>
          ))}
        </div>
      ) : null;
    }
  )
);
