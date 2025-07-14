import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // 🔥 Import thêm
import App from "./App.tsx";
import "antd/dist/reset.css";

const queryClient = new QueryClient(); // 🔥 Khởi tạo QueryClient

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}> {/* 🔥 Bọc App bằng QueryClientProvider */}
          <App />
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
