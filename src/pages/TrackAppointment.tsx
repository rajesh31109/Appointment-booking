import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackAppointment, TrackedAppointment } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  ArrowLeft,
  Clock,
  Stethoscope,
  Hash,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Users,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TrackAppointment = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TrackedAppointment[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = trackAppointment(query);
    setResults(found);
    setSearched(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-700 border-0">In Progress</Badge>;
      case "waiting":
        return <Badge className="bg-orange-100 text-orange-700 border-0">Waiting</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 border-0">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">MediQueue</span>
            </div>
          </div>
            <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Search Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Track Your Appointment</h1>
          <p className="text-gray-500">
            Enter your Token ID (e.g. TG-CGH-0001) or Phone Number to find your appointment across all hospitals
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="mb-8">
          <Card className="p-2 border-0 shadow-md bg-white dark:bg-gray-900 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Token ID or Phone Number..."
                className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 text-base focus-visible:ring-0"
              />
            </div>
            <Button type="submit" className="h-12 px-6 bg-blue-600 hover:bg-blue-700 shadow-sm text-base">
              Search
            </Button>
          </Card>
        </form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && results && results.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="p-8 border-0 shadow-sm bg-white dark:bg-gray-900 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No Appointment Found</h3>
                <p className="text-sm text-gray-500">
                  No appointment matches "{query}". Please check your Token ID or phone number and try again.
                </p>
              </Card>
            </motion.div>
          )}

          {results && results.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm text-gray-500 font-medium">{results.length} appointment{results.length > 1 ? "s" : ""} found</p>
              {results.map((appt, i) => (
                <motion.div key={appt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                    {/* Token ID header */}
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                          <Hash className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white tracking-wide">{appt.tokenId}</p>
                          <p className="text-xs text-gray-500">Token #{appt.tokenNumber}</p>
                        </div>
                      </div>
                      {getStatusBadge(appt.status)}
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Patient Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Patient</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{appt.name}</p>
                          <p className="text-xs text-gray-500">{appt.age} yrs, {appt.gender}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Contact</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {appt.phone ? appt.phone.replace(/(\d{2})\d{5}(\d{3})/, '$1*****$2') : "—"}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {appt.place}
                          </p>
                        </div>
                                            {/* Date/Time */}
                                            <div>
                                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Booked At</p>
                                              <p className="text-xs text-gray-500">{appt.createdAt ? new Date(appt.createdAt).toLocaleString() : "—"}</p>
                                            </div>
                      </div>

                      {/* Hospital & Doctor */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Hospital</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-blue-600" /> {appt.hospitalName}
                          </p>
                        </div>
                        {appt.doctorName && (
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Doctor</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                              <Stethoscope className="h-3.5 w-3.5 text-emerald-600" /> {appt.doctorName}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Queue Status */}
                      {appt.status === "waiting" && (
                        <div className="rounded-xl bg-orange-50 dark:bg-orange-900/10 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Position in queue</span>
                          </div>
                          <span className="text-2xl font-bold text-orange-600">#{appt.queuePosition}</span>
                        </div>
                      )}
                      {appt.status === "running" && (
                        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/10 p-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">It&apos;s your turn! Please proceed to the doctor.</span>
                        </div>
                      )}
                      {appt.status === "completed" && (
                        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/10 p-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Appointment completed</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Building2 className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">MediQueue</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigate("/doctor")} className="text-xs text-gray-500 gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" /> Doctor
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/reception")} className="text-xs text-gray-500 gap-1.5">
                <UserCheck className="h-3.5 w-3.5" /> Reception
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/superadmin")} className="text-xs text-gray-500 gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" /> Admin
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            © {new Date().getFullYear()} MediQueue. Smart Hospital Appointment Booking & Tracking System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TrackAppointment;
