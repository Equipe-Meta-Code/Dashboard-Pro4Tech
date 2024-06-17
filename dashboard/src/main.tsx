import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ThemeProvider>
);

