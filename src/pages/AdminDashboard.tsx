import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getHospital, getHospitalState, completeAppointment, toggleBooking, subscribeHospitalState } from "@/lib/store";
import { HospitalState } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, Users, Search, CheckCircle2, Power, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const hospital = getHospital(hospitalId || "");
  const [state, setState] = useState<HospitalState>(getHospitalState(hospitalId || ""));
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    setState(getHospitalState(hospitalId || ""));
  }, [hospitalId]);

  useEffect(() => {
    // Check auth
    if (sessionStorage.getItem("admin_hospital") !== hospitalId) {
      navigate("/admin");
      return;
    }
    const cleanup = subscribeHospitalState(hospitalId, refresh);
    return cleanup;
  }, [hospitalId, refresh, navigate]);

  const handleComplete = (tokenNumber: number) => {
    completeAppointment(hospitalId!, tokenNumber);
    refresh();
    toast.success(`Token ${tokenNumber} marked as completed`);
  };

  const handleToggleBooking = () => {
    toggleBooking(hospitalId!);
    refresh();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_hospital");
    navigate("/admin");
  };

  if (!hospital) return null;

  const filtered = state.appointments.filter((a) =>
    search ? a.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const activeAppointments = filtered.filter((a) => a.status !== "completed");
  const completedAppointments = filtered.filter((a) => a.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{hospital.name}</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-4 text-center border-primary/20 bg-accent/30">
              <Activity className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Current Token</p>
              <p className="text-3xl font-bold text-primary animate-pulse-soft">{state.currentToken || "—"}</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="p-4 text-center">
              <Users className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Total Booked</p>
              <p className="text-3xl font-bold text-foreground">{state.totalAppointments}</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Power className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mb-2">Booking</p>
              <Switch checked={state.bookingEnabled} onCheckedChange={handleToggleBooking} />
              <p className="text-xs mt-1 font-medium" style={{ color: state.bookingEnabled ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                {state.bookingEnabled ? "Open" : "Closed"}
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Active Queue */}
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Active Queue</h3>
        {activeAppointments.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground mb-6">No active appointments</Card>
        ) : (
          <div className="space-y-2 mb-6">
            {activeAppointments.map((appt) => (
              <motion.div key={appt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                <Card className={`p-4 flex items-center gap-4 ${appt.status === "running" ? "border-primary/40 bg-accent/20" : ""}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                    appt.status === "running" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {appt.tokenNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{appt.name}</p>
                      {appt.status === "running" && (
                        <Badge className="bg-primary text-primary-foreground text-[10px]">Now Serving</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Age: {appt.age} · {appt.place} · {appt.phone}
                    </p>
                  </div>
                  {appt.status === "running" && (
                    <Button size="sm" variant="outline" className="gap-1 border-success/40 text-success hover:bg-success hover:text-success-foreground" onClick={() => handleComplete(appt.tokenNumber)}>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Completed */}
        {completedAppointments.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Completed</h3>
            <div className="space-y-2 opacity-60">
              {completedAppointments.map((appt) => (
                <Card key={appt.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg bg-success/10 text-success">
                    {appt.tokenNumber}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{appt.name}</p>
                    <p className="text-xs text-muted-foreground">Age: {appt.age} · {appt.place} · {appt.phone}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Done</Badge>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
