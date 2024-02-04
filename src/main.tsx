import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Web3Modal } from "./web3modal.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web3Modal>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Web3Modal>,
);
