import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { UniformField } from "./UniformField";

const mapStateToProps = (state: ViewerState) => {
  return {
    uniformValues: state.uniformValues,
  };
};

export const UniformSection = React.memo(
  connect(mapStateToProps)(({ uniformValues }: { uniformValues: ViewerState["uniformValues"] }) => {
    return Object.keys(uniformValues).length ? (
      <div className="viewer-options-section">
        <SectionTitle text={translations.uniforms}></SectionTitle>
        {Object.entries(uniformValues).map(([name, value]) => (
          <SectionField key={name} text={name}>
            <UniformField name={name} {...value}></UniformField>
          </SectionField>
        ))}
      </div>
    ) : null;
  })
);
