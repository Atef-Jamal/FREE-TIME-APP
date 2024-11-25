import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./context/store";
import "./index.css";
import LoadingWebsite from "./components/others/LoadingWebsite";
import "@fontsource/poppins";
import "@fontsource/roboto";
import "./i18next";
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <Suspense fallback={<LoadingWebsite className="w-screen h-screen" />}>
          <App />
        </Suspense>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
