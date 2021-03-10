import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { viewerEndpoint } from "../../../common/communication/viewerEndpoint";
import { getViewerState } from "../../../common/state";
import { shaderExtensions } from "../constants";
import { ViewerAction } from "../store/actions";
import { ViewerState } from "../store/state";
import { Dropdown, DropdownOption } from "./Dropdown";
import { OptionInput } from "./OptionInput";
import { SectionTitle } from "./SectionTitle";

export const createDiv = (className: string, children?: HTMLElement[]) => {
  const div = document.createElement("div");
  div.className = className;
  children?.forEach(c => div.appendChild(c));
  return div;
};

export function mapStateToProps(state: ViewerState) {
  return {
    selectedVertexFileId: state.vertexFilePath,
    counter: state.counter,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ViewerAction>) {
  return {
    updateCounter: (value: number) =>
      dispatch({ type: "UPADTE_COUNTER", payload: { value } }),
    setSelectedVertexFileId: (value: string | null) =>
      dispatch({ type: "SET_VERTEX_FILE_PATH", payload: { path: value } }),
  };
}

export const ViewerOptions = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props: {
    selectedVertexFileId: string;
    counter: number;
    setSelectedVertexFileId: (value: string | null) => void;
  }) => {
    const { selectedVertexFileId, setSelectedVertexFileId } = props;
    const [selectedFragmentFileId, setSelectedFragmentFileId] = React.useState<
      string | null
    >(null);
    const [shaderFileOptions, setShaderFileOptions] = React.useState<
      DropdownOption[]
    >([]);

    const syncShaderDocuments = React.useCallback(() => {
      viewerEndpoint.getWorkspaceFilesOfTypes(shaderExtensions).then(sd =>
        setShaderFileOptions(
          sd.map(f => ({
            id: f.filePath,
            display: f.fileName,
          }))
        )
      );
    }, []);

    React.useEffect(() => {
      syncShaderDocuments();
      viewerEndpoint.showWebViewDevTools();
    }, []);

    let selectedVertexFileWatcherUnsubscribe: () => void | undefined;

    return (
      <div className="viewer-options">
        <div className="viewer-shaders-title">
          <SectionTitle text="Sync"></SectionTitle>
          <button
            className="viewer-refresh-button"
            onClick={syncShaderDocuments}
          >
            Sync
          </button>
        </div>
        <OptionInput text={"Vertex Shader"}>
          <Dropdown
            selectedItemId={selectedVertexFileId}
            onChange={setSelectedVertexFileId}
            options={shaderFileOptions}
          ></Dropdown>
        </OptionInput>
        <OptionInput text={"Fragment Shader"}>
          <Dropdown
            selectedItemId={selectedFragmentFileId}
            onChange={setSelectedFragmentFileId}
            options={shaderFileOptions}
          ></Dropdown>
        </OptionInput>
      </div>
    );
  }
);
