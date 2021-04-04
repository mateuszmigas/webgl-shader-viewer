import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { TextureField } from "./TextureField";
import { shallowEqualArrays } from "@utils/object";

const mapStateToProps = (state: ViewerState) => {
  return {
    textures: Object.keys(state.textureValues),
  };
};

export const TextureSection = connect(mapStateToProps, null, null, {
  areStatePropsEqual: (o, n) => shallowEqualArrays(o.textures, n.textures),
})(
  React.memo(({ textures }: { textures: string[] }) => {
    return textures.length ? (
      <div className="viewer-options-section">
        <SectionTitle text={translations.textures.title}></SectionTitle>
        {textures.map(name => (
          <SectionField key={name} text={name}>
            <TextureField name={name}></TextureField>
          </SectionField>
        ))}
      </div>
    ) : null;
  })
);
