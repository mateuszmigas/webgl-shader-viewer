import React from "react";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { UniformField } from "./UniformField";
import { objectMap, shallowEqual } from "@utils/object";
import { useViewerSelector } from "@viewerStore";

export const UniformSection = React.memo(() => {
  const uniforms = useViewerSelector(
    state => objectMap(state.uniformValues, propValue => propValue.type),
    shallowEqual
  );
  return Object.keys(uniforms).length ? (
    <div className="viewer-options-section">
      <SectionTitle text={translations.uniforms}></SectionTitle>
      {Object.entries(uniforms).map(([name, type]) => (
        <SectionField key={name} text={name}>
          <UniformField name={name} type={type}></UniformField>
        </SectionField>
      ))}
    </div>
  ) : null;
});
