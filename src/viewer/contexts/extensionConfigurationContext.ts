import React from "react";
import { ExtensionConfiguration } from "extensionConfiguration";

export const ExtensionConfigurationContext = React.createContext<ExtensionConfiguration>({
  renderingContext: "WebGL",
});
