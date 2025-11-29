import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import ClientDetail from "./pages/ClientDetail";
import Matching from "./pages/Matching";
import Inbox from "./pages/Inbox";
import MandantDashboard from "./pages/MandantDashboard";
import MandantTransactions from "./pages/MandantTransactions";
import MandantBelegUpload from "./pages/MandantBelegUpload";
import MandantBelege from "./pages/MandantBelege";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/clients/:id/matching" element={<Matching />} />
                  <Route path="/mandant/dashboard" element={<MandantDashboard />} />
                  <Route path="/mandant/konto-vorgaenge" element={<MandantTransactions />} />
                  <Route path="/mandant/beleg-upload" element={<MandantBelegUpload />} />
                  <Route path="/mandant/belege" element={<MandantBelege />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
