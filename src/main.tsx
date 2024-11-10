import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

if (!CLIENT_ID) {
  throw new Error("CLIENT_ID is not set in environment variables");
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
