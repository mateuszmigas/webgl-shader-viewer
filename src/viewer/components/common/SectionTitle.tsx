import React from "react";

export const SectionTitle = React.memo((props: { text: string; children?: React.ReactNode }) => {
  return (
    <div className="viewer-options-section-title">
      <h3>{props.text}</h3>
      {props.children ?? null}
    </div>
  );
});

//element.title = '1 2123',, `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28L2.28 13H13.7L8 2.28zM8.625 12v-1h-1.25v1h1.25zm-1.25-2V6h1.25v4h-1.25z"/></svg>`;