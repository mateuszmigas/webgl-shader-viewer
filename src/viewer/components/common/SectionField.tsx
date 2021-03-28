import React from "react";

export const SectionField = React.memo((props: { text: string; children: React.ReactNode }) => {
  return (
    <div className="viewer-options-section-field">
      <label className="viewer-options-section-field-label">{props.text}</label>
      {props.children}
    </div>
  );
});
