import React from "react";
import { translations } from "@common/translations";
import { SectionField, SectionTitle } from "../common";
import { TextureField } from "./TextureField";
import { shallowEqual } from "@utils/object";
import { useViewerSelector } from "@viewerStore";

export const TextureSection = React.memo(() => {
  const textures = useViewerSelector(state => Object.keys(state.textureValues), shallowEqual);
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
});
