import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initClientObservability } from "./lib/observability";

initClientObservability();

createRoot(document.getElementById("root")!).render(<App />);
