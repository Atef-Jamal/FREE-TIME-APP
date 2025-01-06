import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./context/store";
import App from "./App";
import "./index.css";
import "@fontsource/poppins";
import "@fontsource/roboto";
import "./i18next";
const root = ReactDOM.createRoot(document.getElementById("root")!);

// const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

root.render(
  <StrictMode>
    <Provider store={store}>
      {/* <QueryClientProvider client={queryClient}> */}
      <App />
      {/* </QueryClientProvider> */}
    </Provider>
  </StrictMode>,
);
