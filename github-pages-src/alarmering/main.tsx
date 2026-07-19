import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AlarmPlaceholder from "../../app/portal/AlarmPlaceholder";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlarmPlaceholder />
  </StrictMode>,
);
