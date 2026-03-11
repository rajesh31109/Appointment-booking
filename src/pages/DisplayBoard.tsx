import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  getHospital,
  getHospitalState,
  getDoctorsByHospital,
  subscribeHospitalState,
} from "@/lib/store";
import { HospitalState } from "@/lib/types";
import { motion } from "framer-motion";
import { Building2, Monitor, ArrowLeft, Stethoscope, Users, Clock, Activity, CheckCircle2, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DisplayBoard = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const hospital = getHospital(hospitalId || "");
  const doctors = getDoctorsByHospital(hospitalId || "");
  const [state, setState] = useState<HospitalState>(getHospitalState(hospitalId || ""));

  const refresh = useCallback(() => {
    setState(getHospitalState(hospitalId || ""));
  }, [hospitalId]);

  useEffect(() => {
    const cleanup = subscribeHospitalState(hospitalId, refresh);
    const interval = setInterval(refresh, 5000);
    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [hospitalId, refresh]);

  if (!hospital) return null;

  const doctorQueues = doctors.map((doc) => {
    const docAppointments = state.appointments.filter((a) => a.doctorId === doc.id);
    const current = docAppointments.find((a) => a.status === "running");
    const waiting = docAppointments.filter((a) => a.status === "waiting");
    const completed = docAppointments.filter((a) => a.status === "completed");
    const next = waiting.length > 0 ? waiting[0] : null;
    return { doctor: doc, current, next, waitingCount: waiting.length, completedCount: completed.length };
  });

  const totalWaiting = state.appointments.filter((a) => a.status === "waiting").length;
  const totalCompleted = state.appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{hospital.name}</h1>
              <p className="text-xs text-gray-500">Live Queue Display</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 py-1 px-3">
              <Users className="h-3.5 w-3.5" />
              {totalWaiting} waiting
            </Badge>
            <Badge variant="outline" className="gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 py-1 px-3">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {totalCompleted} done
            </Badge>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <div className="flex items-center gap-1.5 text-gray-400">
              <Monitor className="h-4 w-4" />
              <span className="text-xs font-medium">Display Board</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 dark:hover:text-white" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Exit
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 pb-20">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5 border-0 shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-blue-200 uppercase tracking-wider">Now Serving</p>
              <p className="text-4xl font-bold mt-1">{state.currentToken || "—"}</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Waiting</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{totalWaiting}</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Completed</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{totalCompleted}</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="p-5 border-0 shadow-sm bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Hash className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Tokens</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{state.totalAppointments}</p>
            </Card>
          </motion.div>
        </div>

        {/* Doctor Queues Grid */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Doctor Queues</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctorQueues.map((dq, i) => (
            <motion.div
              key={dq.doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                {/* Doctor Header */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{dq.doctor.name}</h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">{dq.doctor.specialty}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-500">
                    {dq.waitingCount} in queue
                  </Badge>
                </div>

                <div className="p-5 space-y-4">
                  {/* Current Patient */}
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Current Patient</p>
                    {dq.current ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                          {dq.current.tokenNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{dq.current.name}</p>
                          <p className="text-xs text-blue-600 font-mono font-semibold">{dq.current.tokenId}</p>
                          <p className="text-[10px] text-gray-500">{dq.current.createdAt ? new Date(dq.current.createdAt).toLocaleString() : ""}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No patient currently</p>
                    )}
                  </div>

                  {/* Next Up */}
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Next Up</p>
                    {dq.next ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm text-gray-600 dark:text-gray-300">
                          {dq.next.tokenNumber}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{dq.next.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{dq.next.tokenId}</p>
                          <p className="text-[10px] text-gray-500">{dq.next.createdAt ? new Date(dq.next.createdAt).toLocaleString() : ""}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No one waiting</p>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                      <span className="text-xs text-gray-500">Waiting: <span className="font-semibold text-gray-900 dark:text-white">{dq.waitingCount}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-gray-500">Done: <span className="font-semibold text-gray-900 dark:text-white">{dq.completedCount}</span></span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* All Waiting Tokens */}
        {state.appointments.filter((a) => a.status === "waiting").length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <Card className="p-6 border-0 shadow-sm bg-white dark:bg-gray-900">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">All Waiting Tokens</h3>
              <div className="flex flex-wrap gap-3">
                {state.appointments.filter((a) => a.status === "waiting").map((a) => (
                  <div key={a.id} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center min-w-[100px] border border-gray-100 dark:border-gray-700">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">#{a.tokenNumber}</p>
                    <p className="text-[10px] text-blue-600 font-mono font-semibold">{a.tokenId}</p>
                    <p className="text-[10px] text-gray-500 truncate max-w-[100px]">{a.name}</p>
                    <p className="text-[10px] text-gray-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 py-3">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-xs text-gray-500 font-medium">{hospital.name} &middot; Queue Management System</p>
          </div>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DisplayBoard;
