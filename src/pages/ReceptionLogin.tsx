import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHospitals } from "@/lib/store";
import { motion } from "framer-motion";
import { UserCheck, ArrowLeft, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ReceptionLogin = () => {
  const navigate = useNavigate();
  const hospitals = getHospitals();
  const [hospitalId, setHospitalId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId || !staffName.trim()) {
      toast.error("Please select a hospital and enter your name");
      return;
    }
    sessionStorage.setItem("reception_hospital", hospitalId);
    sessionStorage.setItem("reception_name", staffName.trim());
    navigate(`/reception/dashboard/${hospitalId}`);
    toast.success("Welcome, " + staffName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Button variant="ghost" className="mb-4 gap-2 text-gray-500" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
        <Card className="p-8 shadow-2xl shadow-blue-100/50 dark:shadow-none border-0 bg-white dark:bg-gray-900">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
              <UserCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reception Login</h2>
            <p className="text-sm text-gray-500 mt-1">Hospital staff portal for managing appointments</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Hospital</Label>
              <Select value={hospitalId} onValueChange={setHospitalId}>
                <SelectTrigger className="mt-1.5 h-11 border-gray-200 dark:border-gray-700">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select your hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((h) => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Staff Name</Label>
              <Input value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="Your full name" className="mt-1.5 h-11 border-gray-200 dark:border-gray-700" />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="mt-1.5 h-11 border-gray-200 dark:border-gray-700" />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">Sign In</Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReceptionLogin;
