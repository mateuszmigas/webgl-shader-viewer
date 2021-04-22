import { viewerEndpoint } from "@communication/viewerEndpoint";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ExtensionConfigurationContext } from "./contexts/extensionConfigurationContext";
import { Viewer } from "./components/Viewer";
import { store } from "./store";

viewerEndpoint.getExtensionConfiguration().then(config => {
  ReactDOM.render(
    <ExtensionConfigurationContext.Provider value={config}>
      <Provider store={store}>
        <Viewer />
      </Provider>
    </ExtensionConfigurationContext.Provider>,
    document.getElementById("viewer")
  );
});
