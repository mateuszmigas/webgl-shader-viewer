import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { TextureField } from "./TextureField";

const mapStateToProps = (state: ViewerState) => {
  return {
    textureValues: state.textureValues,
  };
};

export const TextureSection = connect(mapStateToProps)(
  React.memo(({ textureValues }: { textureValues: ViewerState["textureValues"] }) => {
    return Object.keys(textureValues).length ? (
      <div className="viewer-options-section">
        <SectionTitle text={translations.textures.title}></SectionTitle>
        {Object.entries(textureValues).map(([name, value]) => (
          <SectionField key={name} text={name}>
            <TextureField name={name} {...value}></TextureField>
          </SectionField>
        ))}
      </div>
    ) : null;
  })
);
