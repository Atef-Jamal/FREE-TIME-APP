import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./context/store";
import { Spinner } from "./components";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <Suspense
          fallback={
            <div className="w-screen h-screen flex items-center justify-center">
              <Spinner className="w-28 h-28 sm:w-20 sm:h-20 sm:border-[4px] border-[7px] mx-auto" />
            </div>
          }
        >
          <App />
        </Suspense>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
