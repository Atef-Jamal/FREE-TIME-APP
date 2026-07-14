import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import store from "./context/store";
import App from "./App";
import "./i18next";
import "@fontsource/roboto";
import "@fontsource/poppins";
import "./index.css";
import "./App.css";

import { queryClient } from "./lib/tanstack-query/confige";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
        <Analytics />
        <SpeedInsights debug={false} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
