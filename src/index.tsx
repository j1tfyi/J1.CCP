import { React, ReactDOM } from "../deps.client.ts";
import App from "./App.tsx";

const rootElem = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElem);
root.render(<App />);