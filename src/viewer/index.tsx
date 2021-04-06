import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Viewer } from "./components/Viewer";
import { store } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <Viewer />
  </Provider>,
  document.getElementById("viewer")
);
