import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { UniformType } from "@utils/webgl/uniform";
import { SectionField } from "../SectionField";
import { SectionTitle } from "../SectionTitle";
import { UniformField } from "./UniformField";

const mapStateToProps = (state: ViewerState) => {
  return {
    values: state.uniformValues,
  };
};

export type UniformFieldInfo = { name: string; type: UniformType };

export const UniformSection = React.memo(
  connect(mapStateToProps)(({ uniformFields }: { uniformFields: UniformFieldInfo[] }) => {
    return (
      <div className="viewer-options-section">
        <SectionTitle text={translations.uniforms}></SectionTitle>
        {uniformFields.map(uf => (
          <SectionField key={uf.name} text={uf.name}>
            <UniformField {...uf}></UniformField>
          </SectionField>
        ))}
      </div>
    );
  })
);
