import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { ViewerAction } from "@viewerStore/actions";
import { ViewerState } from "@viewerStore/state";
import { TextInput } from "../common/TextInput";
import { Dropdown } from "../common/Dropdown";
import { getTextureBindingOptions } from "@utils/webgl/texture/textureUtils";
import { customImageUrl, workspaceImageUrl } from "@common/constants";

type OwnProps = {
  name: string;
};

const mapStateToProps = (state: ViewerState, ownProps: OwnProps) => {
  return {
    ...state.textureValues[ownProps.name],
    workspaceImageOptions: state.userWorkspace.imageOptions,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ViewerAction>, ownProps: OwnProps) => {
  return {
    setOption: (optionId: string) => {
      return dispatch({
        type: "SET_TEXTURE_OPTION",
        payload: {
          ...ownProps,
          optionId,
        },
      });
    },
    setWorkspaceUrl: (workspaceUrl: string) => {
      return dispatch({
        type: "SET_TEXTURE_WORKSPACE_URL",
        payload: {
          ...ownProps,
          workspaceUrl,
        },
      });
    },
    serCustomUrl: (customUrl: string) => {
      return dispatch({
        type: "SET_TEXTURE_CUSTOM_URL",
        payload: {
          ...ownProps,
          customUrl,
        },
      });
    },
  };
};

export const TextureField = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  React.memo(
    (props: {
      name: string;
      optionId: string;
      customUrl: string;
      error: string;
      workspaceUrl: string;
      workspaceImageOptions: { id: string; display: string }[];
      setOption: (optionId: string) => void;
      serCustomUrl: (customUrl: string) => void;
      setWorkspaceUrl: (workspaceUrl: string) => void;
    }) => {
      const {
        optionId,
        customUrl,
        error,
        workspaceUrl,
        workspaceImageOptions,
        setOption,
        serCustomUrl,
        setWorkspaceUrl,
      } = props;
      const options = React.useMemo(
        () => [customImageUrl, workspaceImageUrl, ...getTextureBindingOptions()],
        []
      );
      const isCustomUrl = optionId === customImageUrl.id;
      const isWorkspaceUrl = optionId === workspaceImageUrl.id;

      return (
        <div>
          {options.length > 1 && (
            <Dropdown selectedItemId={optionId} onChange={setOption} options={options}></Dropdown>
          )}
          {isCustomUrl && (
            <TextInput value={customUrl} error={error} onChange={serCustomUrl}></TextInput>
          )}
          {isWorkspaceUrl && (
            <Dropdown
              selectedItemId={workspaceUrl}
              onChange={setWorkspaceUrl}
              options={workspaceImageOptions}
            ></Dropdown>
          )}
        </div>
      );
    }
  )
);
