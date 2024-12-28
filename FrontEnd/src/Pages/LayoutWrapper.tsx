import { lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const Layout = lazy(() => import("../components/Layout/Layout"));

const LayoutWrapper = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
};

export default LayoutWrapper;
