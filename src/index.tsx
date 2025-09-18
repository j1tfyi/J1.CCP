import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const rootElem = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElem);
root.render(<App />);