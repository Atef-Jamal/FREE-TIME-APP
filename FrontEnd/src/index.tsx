import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Provider } from "react-redux";
import store from "./context/store";
import App from "./App";
import "./index.css";
import "./App.css";
import "@fontsource/poppins";
import "@fontsource/roboto";
import "./i18next";
import { queryClient } from "./tanstackQuery/confige";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <SpeedInsights debug={false} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
