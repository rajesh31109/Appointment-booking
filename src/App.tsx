import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HospitalSelect from "./pages/HospitalSelect";
import PatientDashboard from "./pages/PatientDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ReceptionLogin from "./pages/ReceptionLogin";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import DisplayBoard from "./pages/DisplayBoard";
import SuperAdminPortal from "./pages/SuperAdminPortal";
import TrackAppointment from "./pages/TrackAppointment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HospitalSelect />} />
          <Route path="/track" element={<TrackAppointment />} />
          <Route path="/hospital/:hospitalId" element={<PatientDashboard />} />

          {/* Legacy staff login */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard/:hospitalId" element={<AdminDashboard />} />

          {/* Reception */}
          <Route path="/reception" element={<ReceptionLogin />} />
          <Route path="/reception/dashboard/:hospitalId" element={<ReceptionDashboard />} />


          {/* Display Board */}
          <Route path="/display/:hospitalId" element={<DisplayBoard />} />

          {/* Super Admin */}
          <Route path="/superadmin" element={<SuperAdminPortal />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
