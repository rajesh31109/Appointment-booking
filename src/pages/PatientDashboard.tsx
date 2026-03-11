import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getHospital, getHospitalState, bookAppointment, getDoctorsByHospital, subscribeHospitalState } from "@/lib/store";
import { Appointment, HospitalState, Doctor } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarPlus, Activity, Users, Hash, Clock, Stethoscope, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const PatientDashboard = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const hospital = getHospital(hospitalId || "");
  const doctors = getDoctorsByHospital(hospitalId || "");
  const [state, setState] = useState<HospitalState>(getHospitalState(hospitalId || ""));
  const [showForm, setShowForm] = useState(false);
  const [myToken, setMyToken] = useState<number | null>(null);

  const refresh = useCallback(() => {
    setState(getHospitalState(hospitalId || ""));
  }, [hospitalId]);

  useEffect(() => {
    const cleanup = subscribeHospitalState(hospitalId, refresh);
    return cleanup;
  }, [hospitalId, refresh]);

  useEffect(() => {
    const saved = localStorage.getItem(`my_token_${hospitalId}`);
    if (saved) setMyToken(parseInt(saved));
  }, [hospitalId]);

  const [form, setForm] = useState({ name: "", age: "", gender: "" as string, place: "", phone: "", reason: "", doctorId: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.place || !form.phone || !form.doctorId) {
      toast.error("Please fill all required fields and select a doctor");
      return;
    }
    const appt = bookAppointment(hospitalId!, {
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender as "male" | "female" | "other",
      place: form.place,
      phone: form.phone,
      reason: form.reason || undefined,
    }, form.doctorId);
    setMyToken(appt.tokenNumber);
    localStorage.setItem(`my_token_${hospitalId}`, appt.tokenNumber.toString());
    setShowForm(false);
    setForm({ name: "", age: "", gender: "", place: "", phone: "", reason: "", doctorId: "" });
    toast.success(`Appointment booked! Your Token ID: ${appt.tokenId}`);
    refresh();
  };

  if (!hospital) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Hospital not found</div>;
  }

  const remaining = myToken ? Math.max(0, myToken - state.currentToken) : null;
  const myAppt = myToken ? state.appointments.find((a) => a.tokenNumber === myToken) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-3 py-4 px-4">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">{hospital.name}</h1>
              <p className="text-xs text-gray-500">{hospital.address}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-5 text-center border-0 shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <Activity className="h-5 w-5 mx-auto mb-2 text-blue-200" />
              <p className="text-xs text-blue-200 uppercase tracking-wider">Current Token</p>
              <p className="text-4xl font-bold mt-1">
                {state.currentToken || "—"}
              </p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 text-center border-0 shadow-sm bg-white dark:bg-gray-900">
              <Users className="h-5 w-5 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Booked</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{state.totalAppointments}</p>
            </Card>
          </motion.div>
        </div>

        {/* My Token Tracking */}
        {myToken && myAppt && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5 mb-6 border-0 shadow-sm bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-600" />
                Your Appointment
              </h3>
              {myAppt.tokenId && (
                <div className="mb-3 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Token ID</p>
                  <p className="text-lg font-bold text-blue-600 tracking-wider">{myAppt.tokenId}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">Your Token</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{myToken}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="text-2xl font-bold text-blue-600">{state.currentToken}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                  <p className="text-xs text-gray-500">Remaining</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {myAppt.status === "completed" ? "Done" : remaining}
                  </p>
                </div>
              </div>
              {myAppt.status === "running" && (
                <p className="text-center text-sm text-blue-600 font-medium mt-3 flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" /> It&apos;s your turn!
                </p>
              )}
              {myAppt.status === "completed" && (
                <p className="text-center text-sm text-emerald-600 font-medium mt-3">✓ Appointment completed</p>
              )}
            </Card>
          </motion.div>
        )}

        {/* Book Button / Form */}
        {!showForm ? (
          state.bookingEnabled ? (
            <Button className="w-full gap-2 h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" onClick={() => setShowForm(true)}>
              <CalendarPlus className="h-5 w-5" />
              Book Appointment
            </Button>
          ) : (
            <Card className="p-6 text-center border-0 shadow-sm bg-orange-50 dark:bg-orange-900/10">
              <p className="text-orange-600 font-medium">Appointment booking is currently closed.</p>
              <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
            </Card>
          )
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="p-6 border-0 shadow-sm bg-white dark:bg-gray-900">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Book Appointment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Name *</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="mt-1 border-gray-200" />
                    </div>
                    <div>
                      <Label className="text-gray-600">Age *</Label>
                      <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" className="mt-1 border-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Gender *</Label>
                    <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                      <SelectTrigger className="mt-1 border-gray-200"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-600">Address *</Label>
                    <Input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="Address" className="mt-1 border-gray-200" />
                  </div>
                  <div>
                    <Label className="text-gray-600">Phone *</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className="mt-1 border-gray-200" />
                  </div>
                  <div>
                    <Label className="text-gray-600">Select Doctor *</Label>
                    <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v })}>
                      <SelectTrigger className="mt-1 border-gray-200">
                        <Stethoscope className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-600">Reason for Visit (optional)</Label>
                    <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Brief description" className="mt-1 border-gray-200" />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm">Submit</Button>
                    <Button type="button" variant="outline" className="border-gray-200" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
