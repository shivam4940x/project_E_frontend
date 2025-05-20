import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

import App from "./App.tsx";
import "./css/main.css";
import "./css/tailwind.css";
import "./css/fonts.css";

import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { BrowserRouter } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import theme from "@/Theme.ts"; // Your custom MUI theme


const cache = createCache({ key: "css", prepend: true });
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CacheProvider value={cache}>
      <StyledEngineProvider enableCssLayer>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <BrowserRouter>
            <ToastContainer autoClose={2500} />
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <App />
            </QueryClientProvider>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  </StrictMode>
);
