import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateAdmin } from "@/lib/store";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId || !password) {
      toast.error("Please fill all fields");
      return;
    }
    const validHospitalId = validateAdmin(hospitalId, password);
    if (validHospitalId) {
      sessionStorage.setItem("admin_hospital", validHospitalId);
      navigate(`/admin/dashboard/${validHospitalId}`);
      toast.success("Login successful");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Card className="p-8">
          <div className="text-center mb-6">
            <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-foreground">Staff Login</h2>
            <p className="text-sm text-muted-foreground mt-1">Access the admin dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="hospitalId">Hospital ID</Label>
              <Input id="hospitalId" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} placeholder="e.g. h1, h2, h3, h4" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
