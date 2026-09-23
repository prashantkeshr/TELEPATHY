import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/services/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { router } from "@/app/router";

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  );
}
