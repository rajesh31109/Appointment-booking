import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getHospitals,
  getAllAnalytics,
  getAllDoctors,
  getDoctorsByHospital,
  addDoctor,
  removeDoctor,
  addHospital,
  getHospitalsCount,
  getHospitalState,
} from "@/lib/store";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Stethoscope,
  CalendarCheck,
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Activity,
  LayoutDashboard,
  Search,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import DashboardSidebar, { DashboardLayout } from "@/components/DashboardSidebar";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/superadmin" },
  { label: "Hospitals", icon: Building2, path: "/superadmin?tab=hospitals" },
  { label: "Doctors", icon: Stethoscope, path: "/superadmin?tab=doctors" },
  { label: "Appointments", icon: CalendarCheck, path: "/superadmin?tab=appointments" },
];

const SuperAdminPortal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("superadmin"));
  const [password, setPassword] = useState("");
  const [, setRefreshTick] = useState(0);

  const [newDocHospital, setNewDocHospital] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("");
  const [newHospName, setNewHospName] = useState("");
  const [newHospAddress, setNewHospAddress] = useState("");
  const [newHospPhone, setNewHospPhone] = useState("");

  const refresh = () => setRefreshTick((t) => t + 1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("superadmin", "true");
    setIsLoggedIn(true);
    toast.success("Welcome, Super Admin");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("superadmin");
    setIsLoggedIn(false);
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Button variant="ghost" className="mb-4 gap-2 text-gray-500" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
          <Card className="p-8 shadow-2xl shadow-blue-100/50 dark:shadow-none border-0 bg-white dark:bg-gray-900">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin</h2>
              <p className="text-sm text-gray-500 mt-1">Platform management & analytics</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Admin Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="mt-1.5 h-11 border-gray-200 dark:border-gray-700" />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">Sign In</Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  const analytics = getAllAnalytics();
  const hospitals = getHospitals();
  const allDoctors = getAllDoctors();
  const totalBookings = analytics.reduce((sum, a) => sum + a.totalBookings, 0);
  const totalTodayBookings = analytics.reduce((sum, a) => sum + a.todayBookings, 0);
  const totalActive = analytics.reduce((sum, a) => sum + a.active, 0);
  const totalCompleted = analytics.reduce((sum, a) => sum + a.completed, 0);
  const allAppointments = hospitals.flatMap((h) => {
    const state = getHospitalState(h.id);
    return state.appointments.map((a) => ({ ...a, hospitalName: h.name }));
  });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocHospital || !newDocName.trim()) { toast.error("Please select a hospital and enter doctor name"); return; }
    addDoctor(newDocHospital, newDocName.trim(), newDocSpecialty.trim() || undefined);
    setNewDocName(""); setNewDocSpecialty(""); refresh();
    toast.success("Doctor added successfully");
  };
  const handleRemoveDoctor = (docId: string) => { removeDoctor(docId); refresh(); toast.success("Doctor removed"); };
  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName.trim() || !newHospAddress.trim() || !newHospPhone.trim()) { toast.error("Please fill all hospital fields"); return; }
    addHospital(newHospName.trim(), newHospAddress.trim(), newHospPhone.trim());
    setNewHospName(""); setNewHospAddress(""); setNewHospPhone(""); refresh();
    toast.success("Hospital onboarded successfully");
  };

  const sidebar = (
    <DashboardSidebar brand="MediQueue" items={sidebarItems} onLogout={handleLogout} userName="Admin" userRole="Super Admin" />
  );

  return (
    <DashboardLayout sidebar={sidebar}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{tab}</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-10 w-64 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl" />
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </div>
      </header>

      <main className="p-8">
        {/* ─── Dashboard ─── */}
        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Stethoscope className="h-5 w-5" /></div>
                  <span className="text-sm font-medium text-blue-100">Total Doctors</span>
                </div>
                <p className="text-3xl font-bold">{allDoctors.length}</p>
                <p className="text-xs text-blue-200 mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Across {getHospitalsCount()} hospitals</p>
              </Card>
              <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><Users className="h-5 w-5 text-emerald-600" /></div>
                  <span className="text-sm font-medium text-gray-500">Total Patients</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalBookings}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> 1.3% Up from past week</p>
              </Card>
              <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center"><Activity className="h-5 w-5 text-orange-500" /></div>
                  <span className="text-sm font-medium text-gray-500">Active Now</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalActive}</p>
                <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Currently in queue</p>
              </Card>
              <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center"><CalendarCheck className="h-5 w-5 text-violet-600" /></div>
                  <span className="text-sm font-medium text-gray-500">Total Appointments</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalBookings}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> 1.8% Up from yesterday</p>
              </Card>
            </div>

            {/* 3-column grid: Appointments / Hospital Overview / Doctors List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Appointments</h3>
                  <Button variant="link" size="sm" className="text-blue-600 text-xs p-0 h-auto" onClick={() => navigate("/superadmin?tab=appointments")}>View all</Button>
                </div>
                <div className="px-5 pb-5 space-y-4 max-h-[340px] overflow-y-auto">
                  {allDoctors.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.specialty}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">Today</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Hospital Overview</h3>
                </div>
                <div className="px-5 pb-5 space-y-3">
                  {analytics.map((a) => (
                    <div key={a.hospital.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${a.bookingEnabled ? "bg-emerald-500" : "bg-red-400"}`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{a.hospital.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{a.totalBookings}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Doctors List</h3>
                </div>
                <div className="px-5 pb-5 space-y-3 max-h-[340px] overflow-y-auto">
                  {allDoctors.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                        <Stethoscope className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.specialty}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Bottom: Today's Activity + Specialty */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Activity</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                    <p className="text-2xl font-bold text-blue-600">{totalTodayBookings}</p>
                    <p className="text-xs text-gray-500 mt-1">Bookings Today</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10">
                    <p className="text-2xl font-bold text-emerald-600">{totalCompleted}</p>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10">
                    <p className="text-2xl font-bold text-orange-500">{totalActive}</p>
                    <p className="text-xs text-gray-500 mt-1">In Queue</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {analytics.map((a) => (
                    <div key={a.hospital.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{a.hospital.name}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{a.totalBookings}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${totalBookings > 0 ? (a.totalBookings / totalBookings) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Specialty Distribution</h3>
                <div className="space-y-3">
                  {(() => {
                    const specialties: Record<string, number> = {};
                    allDoctors.forEach((d) => { specialties[d.specialty || "General"] = (specialties[d.specialty || "General"] || 0) + 1; });
                    const colors = ["bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-violet-500", "bg-pink-500", "bg-cyan-500", "bg-amber-500"];
                    return Object.entries(specialties).map(([spec, count], i) => (
                      <div key={spec} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{spec}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                      </div>
                    ));
                  })()}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-center gap-10">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{getHospitalsCount()}</p>
                      <p className="text-xs text-gray-500">Hospitals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{allDoctors.length}</p>
                      <p className="text-xs text-gray-500">Doctors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-violet-600">{totalBookings}</p>
                      <p className="text-xs text-gray-500">Patients</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ─── Hospitals ─── */}
        {tab === "hospitals" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 border-0 shadow-sm bg-white dark:bg-gray-900 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-blue-600" /> Onboard New Hospital</h3>
              <form onSubmit={handleAddHospital} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div><Label className="text-gray-600">Hospital Name</Label><Input value={newHospName} onChange={(e) => setNewHospName(e.target.value)} placeholder="Hospital name" className="mt-1 border-gray-200" /></div>
                <div><Label className="text-gray-600">Address</Label><Input value={newHospAddress} onChange={(e) => setNewHospAddress(e.target.value)} placeholder="Full address" className="mt-1 border-gray-200" /></div>
                <div><Label className="text-gray-600">Phone</Label><Input value={newHospPhone} onChange={(e) => setNewHospPhone(e.target.value)} placeholder="Phone number" className="mt-1 border-gray-200" /></div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-sm">Add Hospital</Button>
              </form>
            </Card>
            <div className="space-y-3">
              {hospitals.map((h) => {
                const docs = getDoctorsByHospital(h.id);
                const a = analytics.find((x) => x.hospital.id === h.id);
                return (
                  <Card key={h.id} className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><Building2 className="h-6 w-6 text-blue-600" /></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{h.name}</h4>
                        <p className="text-sm text-gray-500">{h.address} &middot; {h.phone}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{docs.length} doctor(s) &middot; {a?.totalBookings || 0} bookings</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={a?.bookingEnabled ? "default" : "destructive"} className="text-xs">{a?.bookingEnabled ? "Open" : "Closed"}</Badge>
                      <Badge variant="outline" className="text-xs font-mono">{h.id}</Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── Doctors ─── */}
        {tab === "doctors" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 border-0 shadow-sm bg-white dark:bg-gray-900 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-emerald-600" /> Add Doctor to Hospital</h3>
              <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div><Label className="text-gray-600">Hospital</Label>
                  <Select value={newDocHospital} onValueChange={setNewDocHospital}><SelectTrigger className="mt-1 border-gray-200"><SelectValue placeholder="Select hospital" /></SelectTrigger>
                    <SelectContent>{hospitals.map((h) => (<SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-gray-600">Doctor Name</Label><Input value={newDocName} onChange={(e) => setNewDocName(e.target.value)} placeholder="Dr. Full Name" className="mt-1 border-gray-200" /></div>
                <div><Label className="text-gray-600">Specialty</Label><Input value={newDocSpecialty} onChange={(e) => setNewDocSpecialty(e.target.value)} placeholder="e.g. Cardiology" className="mt-1 border-gray-200" /></div>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">Add Doctor</Button>
              </form>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allDoctors.map((doc) => {
                const hosp = hospitals.find((h) => h.id === doc.hospitalId);
                return (
                  <Card key={doc.id} className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><Stethoscope className="h-5 w-5 text-emerald-600" /></div>
                      <div><p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p><p className="text-xs text-gray-500">{doc.specialty || "General"} &middot; {hosp?.name}</p></div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 hover:text-red-600" onClick={() => handleRemoveDoctor(doc.id)}><Trash2 className="h-4 w-4" /></Button>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── Appointments ─── */}
        {tab === "appointments" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900 text-center"><p className="text-3xl font-bold text-blue-600">{totalBookings}</p><p className="text-xs text-gray-500 mt-1">Total</p></Card>
              <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900 text-center"><p className="text-3xl font-bold text-orange-500">{totalActive}</p><p className="text-xs text-gray-500 mt-1">Active</p></Card>
              <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900 text-center"><p className="text-3xl font-bold text-emerald-600">{totalCompleted}</p><p className="text-xs text-gray-500 mt-1">Completed</p></Card>
            </div>
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800"><h3 className="font-semibold text-gray-900 dark:text-white">All Appointments</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                    <th className="px-5 py-3">Token</th><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Hospital</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
                  </tr></thead>
                  <tbody>{allAppointments.slice(0, 30).map((appt) => (
                    <tr key={appt.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3"><span className="font-bold text-gray-900 dark:text-white">#{appt.tokenNumber}</span></td>
                      <td className="px-5 py-3"><p className="text-sm font-medium text-gray-900 dark:text-white">{appt.name}</p><p className="text-xs text-gray-500">{appt.phone}</p></td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{appt.hospitalName}</td>
                      <td className="px-5 py-3">
                        <Badge className={`text-xs ${appt.status === "completed" ? "bg-emerald-100 text-emerald-700" : appt.status === "running" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                          {appt.status === "running" ? "In Progress" : appt.status === "completed" ? "Completed" : "Waiting"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{new Date(appt.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default SuperAdminPortal;
