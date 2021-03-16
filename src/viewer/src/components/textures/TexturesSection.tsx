import React from "react";
import { connect } from "react-redux";
import { ViewerState } from "../../store/state";
import { translations } from "../../translations";
import { SectionField } from "../SectionField";
import { SectionTitle } from "../SectionTitle";
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
          <SectionField text={tx.name}>
            <TextureField {...tx}></TextureField>
          </SectionField>
        ))}
      </div>
    );
  })
);
