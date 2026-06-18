import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 👇 ADD THIS IMPORT
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 👇 Wrap App with Context Provider */}
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);