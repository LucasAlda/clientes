import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/index.css";
import { ToastProvider } from "react-toast-notifications";
import App from "./routes/App";

ReactDOM.render(
  <ToastProvider placement="bottom-right" autoDismiss={true}>
    <App />
  </ToastProvider>,
  document.getElementById("root")
);
