import React from "react";
import "./App.css";
import { LoginScreen, MainScreen } from "./pages";
import { Routes, Route } from "react-router-dom";
import ThemeProvider from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./pages/auth/Auth";
// import dotenv from "dotenv-webpack";
// dotenv.config()

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  });
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* <Route path="/" element={<LoginScreen />} /> */}
          <Route
            path="/"
            element={
              // <Auth>
                <MainScreen />
              // </Auth>
            }
          />
          <Route path="/logout" element={<LoginScreen />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
