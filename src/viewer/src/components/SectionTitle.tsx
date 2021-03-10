import React from "react";

export const SectionTitle = React.memo((props: { text: string; children?: React.ReactNode }) => {
  return (
    <div className="viewer-options-section-title">
      <h3>{props.text}</h3>
      {props.children ?? null}
    </div>
  );
});
