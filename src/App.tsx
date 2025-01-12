import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Customers from "@/pages/Customers";
import Invoices from "@/pages/Invoices";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import "./App.css";

// Create a client outside the component to avoid recreation on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/customers"
              element={
                <AuthGuard>
                  <Customers />
                </AuthGuard>
              }
            />
            <Route
              path="/invoices"
              element={
                <AuthGuard>
                  <Invoices />
                </AuthGuard>
              }
            />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;