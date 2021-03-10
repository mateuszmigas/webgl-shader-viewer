import { type } from "os";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { customOptionId, extensionTextures } from "../constants";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import { translations } from "../translations";
import { Dropdown } from "./Dropdown";
import { SectionField } from "./SectionField";
import { SectionTitle } from "./SectionTitle";

const mapStateToProps = (state: ViewerState) => {
  return {
    values: state.textureValues,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>) => {
  return {
    setValue: (name: string, optionId: string, optionValue: string) =>
      dispatch({ type: "SET_TEXTURE", payload: { name, optionId, optionValue } }),
  };
};

export type TextureFieldInfo = { name: string; unit: number };

const options = [
  { id: customOptionId, display: translations.custom },
  ...extensionTextures.map(et => ({ id: et, display: et })),
];

export const TextureSection = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    (props: {
      textureFields: TextureFieldInfo[];
      values: { [key: string]: { optionId: string; optionValue: string } };
      setValue: (name: string, optionId: string, optionValue: string) => void;
    }) => {
      const { textureFields, values, setValue } = props;

      return (
        <div className="viewer-options-section">
          <SectionTitle text={translations.textures}></SectionTitle>
          {textureFields.map(ti => {
            return (
              <SectionField text={ti.name}>
                <TextureInput
                  selectedOptionId={values[ti.name]?.optionId}
                  selectedOptionValue={values[ti.name]?.optionValue}
                  onChange={(optionId, optionValue) => setValue(ti.name, optionId, optionValue)}
                ></TextureInput>
              </SectionField>
            );
          })}
        </div>
      );
    }
  )
);

const TextureInput = (props: {
  selectedOptionId: string;
  selectedOptionValue: string;
  onChange: (optionId: string, optionValue: string) => void;
}) => {
  const { selectedOptionId, selectedOptionValue, onChange } = props;
  return (
    <div>
      <Dropdown
        selectedItemId={selectedOptionId}
        onChange={id =>
          onChange(id, selectedOptionId === customOptionId ? selectedOptionValue : "")
        }
        options={options}
      ></Dropdown>
      {selectedOptionId === customOptionId && (
        <input
          value={selectedOptionValue}
          onChange={e => onChange(selectedOptionId, e.target.value)}
        ></input>
      )}
    </div>
  );
};
