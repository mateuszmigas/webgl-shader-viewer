import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { UniformField } from "./UniformField";
import { objectMap, shallowEqual } from "@utils/object";
import { UniformType } from "@utils/webgl/uniform/uniform";

const mapStateToProps = (state: ViewerState) => {
  return {
    uniforms: objectMap(state.uniformValues, propValue => propValue.type),
  };
};

export const UniformSection = connect(mapStateToProps, null, null, {
  areStatePropsEqual: (o, n) => shallowEqual(o.uniforms, n.uniforms),
})(
  React.memo(({ uniforms }: { uniforms: { [key: string]: UniformType } }) => {
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
  })
);
