import React from "react";
import { shallowEqual } from "react-redux";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { AttributeBufferField } from "./AttributeBufferField";
import { objectMap } from "@utils/object";
import { useViewerSelector } from "@viewerStore";

export const AttributeBuffersSection = React.memo(() => {
  const attributeBuffers = useViewerSelector(
    state => objectMap(state.attributeBufferValues, propValue => propValue.type),
    shallowEqual
  );
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
});
