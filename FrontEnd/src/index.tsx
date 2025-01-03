import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./context/store";
import "./index.css";
import "@fontsource/poppins";
import "@fontsource/roboto";
import "./i18next";
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
