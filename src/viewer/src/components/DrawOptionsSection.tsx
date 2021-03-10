import React from "react";
import { translations } from "../translations";
import { SectionTitle } from "./SectionTitle";

export const DrawOptionsSection = React.memo(() => {
  return (
    <div className="viewer-options-section">
      <SectionTitle text={translations.drawOptions}></SectionTitle>
    </div>
  );
});
