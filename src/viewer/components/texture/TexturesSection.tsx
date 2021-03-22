import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "@viewerStore/state";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { TextureField } from "./TextureField";

const mapStateToProps = (state: ViewerState) => {
  return {
    values: state.textureValues,
  };
};

export type TextureFieldInfo = { name: string };

export const TextureSection = React.memo(
  connect(mapStateToProps)(({ textureFields }: { textureFields: TextureFieldInfo[] }) => {
    return (
      <div className="viewer-options-section">
        <SectionTitle text={translations.textures}></SectionTitle>
        {textureFields.map(tx => (
          <SectionField key={tx.name} text={tx.name}>
            <TextureField {...tx}></TextureField>
          </SectionField>
        ))}
      </div>
    );
  })
);
