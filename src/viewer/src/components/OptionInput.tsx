import React from "react";

export const OptionInput = (props: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="options-wrapper">
      <label>{props.text}</label>
      {props.children}
    </div>
  );
};
