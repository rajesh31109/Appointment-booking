
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  getHospital,
  getHospitalState,
  bookAppointment,
  getDoctorsByHospital,
  completeAppointment,
  toggleBooking,
  subscribeHospitalState,
  addDoctor,
} from "@/lib/store";
import { HospitalState, Doctor } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus,
  Activity,
  Users,
  Search,
  CheckCircle2,
  Power,
  Stethoscope,
  UserPlus,
  LayoutDashboard,
  ClipboardList,
  Monitor,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardSidebar, { DashboardLayout } from "@/components/DashboardSidebar";

const ReceptionDashboard = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const tab = searchParams.get("tab");
  const hospital = getHospital(hospitalId || "");
  const doctors = getDoctorsByHospital(hospitalId || "");
  const [state, setState] = useState<HospitalState>(getHospitalState(hospitalId || ""));
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(action === "book");
  const [filterDoctor, setFilterDoctor] = useState("all");


  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "" as string,
    place: "",
    phone: "",
    reason: "",
    doctorId: "",
  });

  // Doctor add form state and handler (now inside component)
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("");
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) {
      toast.error("Doctor name required");
      return;
    }
    addDoctor(hospitalId!, newDocName, newDocSpecialty);
    setNewDocName("");
    setNewDocSpecialty("");
    setShowAddDoctor(false);
    toast.success("Doctor added successfully");
  };

  const refresh = useCallback(() => {
    setState(getHospitalState(hospitalId || ""));
  }, [hospitalId]);

  useEffect(() => {
    if (sessionStorage.getItem("reception_hospital") !== hospitalId) {
      navigate("/reception");
      return;
    }
    const cleanup = subscribeHospitalState(hospitalId, refresh);
    return cleanup;
  }, [hospitalId, refresh, navigate]);

  const staffName = sessionStorage.getItem("reception_name") || "Receptionist";

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.place || !form.phone || !form.doctorId) {
      toast.error("Please fill all required fields and select a doctor");
      return;
    }
    const appt = bookAppointment(
      hospitalId!,
      {
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender as "male" | "female" | "other",
        place: form.place,
        phone: form.phone,
        reason: form.reason || undefined,
      },
      form.doctorId
    );
    setShowForm(false);
    setForm({ name: "", age: "", gender: "", place: "", phone: "", reason: "", doctorId: "" });
    refresh();
    toast.success(`${appt.tokenId} — Token #${appt.tokenNumber} booked for ${form.name}`);
  };

  const handleComplete = (tokenNumber: number) => {
    completeAppointment(hospitalId!, tokenNumber);
    refresh();
    toast.success(`Token #${tokenNumber} completed`);
  };

  const handleToggleBooking = () => {
    toggleBooking(hospitalId!);
    refresh();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("reception_hospital");
    sessionStorage.removeItem("reception_name");
    navigate("/reception");
  };

  if (!hospital) return null;

  const filtered = state.appointments.filter((a) => {
    const matchSearch = search ? a.name.toLowerCase().includes(search.toLowerCase()) : true;
    const matchDoctor = filterDoctor !== "all" ? a.doctorId === filterDoctor : true;
    return matchSearch && matchDoctor;
  });

  const activeAppointments = filtered.filter((a) => a.status !== "completed");
  const completedAppointments = filtered.filter((a) => a.status === "completed");
  const waitingCount = state.appointments.filter((a) => a.status === "waiting").length;

  const getDoctorName = (doctorId?: string) => {
    if (!doctorId) return "Unassigned";
    const doc = doctors.find((d) => d.id === doctorId);
    return doc ? doc.name : "Unknown";
  };

  const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: `/reception/dashboard/${hospitalId}` },
    { label: "New Booking", icon: UserPlus, path: `/reception/dashboard/${hospitalId}?action=book` },
    { label: "Queue", icon: ClipboardList, path: `/reception/dashboard/${hospitalId}?tab=queue` },
    { label: "Display Board", icon: Monitor, path: `/display/${hospitalId}` },
  ];

  const sidebar = (
    <DashboardSidebar brand="MediQueue" items={sidebarItems} onLogout={handleLogout} userName={staffName} userRole="Reception" />
  );

  return (
    <DashboardLayout sidebar={sidebar}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{hospital.name}</h1>
            <p className="text-sm text-gray-500">Reception Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl" />
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">{staffName.charAt(0).toUpperCase()}</div>
          </div>
        </div>
      </header>

      <main className="p-8">
        {/* Add Doctor Form */}
        <div className="mb-8">
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm mb-2" onClick={() => setShowAddDoctor((v) => !v)}>
            {showAddDoctor ? "Cancel" : "+ Add Doctor"}
          </Button>
          {showAddDoctor && (
            <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-4">
              <div>
                <Label className="text-gray-600">Doctor Name</Label>
                <Input value={newDocName} onChange={(e) => setNewDocName(e.target.value)} placeholder="Dr. Full Name" className="mt-1 border-gray-200" />
              </div>
              <div>
                <Label className="text-gray-600">Specialty</Label>
                <Input value={newDocSpecialty} onChange={(e) => setNewDocSpecialty(e.target.value)} placeholder="e.g. Cardiology" className="mt-1 border-gray-200" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 shadow-sm w-full md:w-auto">Add Doctor</Button>
              </div>
            </form>
          )}
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Activity className="h-5 w-5" /></div>
              <span className="text-sm font-medium text-blue-100">Current Token</span>
            </div>
            <p className="text-3xl font-bold">{state.currentToken || "—"}</p>
            <p className="text-xs text-blue-200 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Now serving</p>
          </Card>
          <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><Users className="h-5 w-5 text-emerald-600" /></div>
              <span className="text-sm font-medium text-gray-500">Total Booked</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{state.totalAppointments}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Today's bookings</p>
          </Card>
          <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center"><Stethoscope className="h-5 w-5 text-orange-500" /></div>
              <span className="text-sm font-medium text-gray-500">Doctors</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{doctors.length}</p>
            <p className="text-xs text-orange-500 mt-1">Available today</p>
          </Card>
          <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center"><Power className="h-5 w-5 text-violet-600" /></div>
              <span className="text-sm font-medium text-gray-500">Booking Status</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Switch checked={state.bookingEnabled} onCheckedChange={handleToggleBooking} />
              <span className={`text-sm font-semibold ${state.bookingEnabled ? "text-emerald-600" : "text-red-500"}`}>{state.bookingEnabled ? "Open" : "Closed"}</span>
            </div>
          </Card>
        </div>

        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => setShowForm(!showForm)}>
            <UserPlus className="h-4 w-4" />
            {showForm ? "Cancel" : "New Appointment"}
          </Button>
          <Select value={filterDoctor} onValueChange={setFilterDoctor}>
            <SelectTrigger className="w-48 border-gray-200 dark:border-gray-700 rounded-xl">
              <SelectValue placeholder="Filter by doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">{waitingCount} waiting</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">{completedAppointments.length} done</span>
          </div>
        </div>

        {/* Booking Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <Card className="p-6 border-0 shadow-sm bg-white dark:bg-gray-900">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CalendarPlus className="h-5 w-5 text-blue-600" />
                  Book New Appointment
                </h3>
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-600">Patient Name *</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="mt-1 border-gray-200" />
                    </div>
                    <div>
                      <Label className="text-gray-600">Age *</Label>
                      <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" className="mt-1 border-gray-200" />
                    </div>
                    <div>
                      <Label className="text-gray-600">Gender *</Label>
                      <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                        <SelectTrigger className="mt-1 border-gray-200"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-600">Address *</Label>
                      <Input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="Address" className="mt-1 border-gray-200" />
                    </div>
                    <div>
                      <Label className="text-gray-600">Phone *</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className="mt-1 border-gray-200" />
                    </div>
                    <div>
                      <Label className="text-gray-600">Assign Doctor *</Label>
                      <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v })}>
                        <SelectTrigger className="mt-1 border-gray-200"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                        <SelectContent>
                          {doctors.map((d) => (
                            <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Reason (optional)</Label>
                    <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Brief description" className="mt-1 border-gray-200" />
                  </div>
                  <Button type="submit" className="px-8 bg-blue-600 hover:bg-blue-700 shadow-sm">Book Appointment</Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Queue */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Active Queue ({activeAppointments.length})</h3>
          </div>
          {activeAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No active appointments</div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {activeAppointments.map((appt) => (
                <motion.div key={appt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout className={`px-5 py-4 flex items-center gap-4 ${appt.status === "running" ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    appt.status === "running" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}>
                    #{appt.tokenNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white">{appt.name}</p>
                      <span className="text-xs font-mono font-semibold text-blue-600">{appt.tokenId}</span>
                      {appt.status === "running" && (
                        <Badge className="bg-blue-100 text-blue-700 text-[10px]">Now Serving</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Age {appt.age} &middot; {appt.gender} &middot; {appt.place} &middot; {appt.phone}
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5 font-medium">
                      <Stethoscope className="inline h-3 w-3 mr-1" />
                      {getDoctorName(appt.doctorId)}
                    </p>
                  </div>
                  {appt.status === "running" && (
                    <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0" onClick={() => handleComplete(appt.tokenNumber)}>
                      <CheckCircle2 className="h-4 w-4" /> Complete
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Completed */}
        {completedAppointments.length > 0 && (
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-500">Completed ({completedAppointments.length})</h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800 opacity-60">
              {completedAppointments.map((appt) => (
                <div key={appt.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 shrink-0">
                    #{appt.tokenNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{appt.name}</p>
                      <span className="text-[10px] font-mono font-semibold text-blue-600">{appt.tokenId}</span>
                    </div>
                    <p className="text-xs text-gray-500">{getDoctorName(appt.doctorId)} &middot; Age {appt.age}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">Done</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </DashboardLayout>
  );
};

export default ReceptionDashboard;
