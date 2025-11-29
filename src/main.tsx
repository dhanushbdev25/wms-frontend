import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// scroll bar
// import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from "react-redux";

// project import
import App from "./App";
import { store } from "./store/store";

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById("root");
const root = createRoot(container!); // add '!' to assert that container is not null
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
);
