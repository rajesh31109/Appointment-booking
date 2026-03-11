import { useNavigate } from "react-router-dom";
import { getHospitals } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowRight,
  CalendarCheck,
  Clock,
  Users,
  CheckCircle2,
  MapPin,
  Phone,
  Stethoscope,
  UserCheck,
  BarChart3,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import heroImg from "@/assets/hero-medical.jpg";
import hospital1Img from "@/assets/hospital-1.jpg";
import hospital2Img from "@/assets/hospital-2.jpg";
import hospital3Img from "@/assets/hospital-3.jpg";
import hospital4Img from "@/assets/hospital-4.jpg";

const hospitalImages: Record<string, string> = {
  h1: hospital1Img,
  h2: hospital2Img,
  h3: hospital3Img,
  h4: hospital4Img,
};

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    desc: "Book your hospital appointment online in seconds — no phone calls, no waiting in line.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    desc: "See the current token number live and know exactly when your turn is coming.",
  },
  {
    icon: Users,
    title: "Queue Transparency",
    desc: "View total appointments and remaining tokens so you can plan your visit better.",
  },
  {
    icon: CheckCircle2,
    title: "Instant Confirmation",
    desc: "Get your token number immediately after booking — no delays, no uncertainty.",
  },
];

const HospitalSelect = () => {
  const navigate = useNavigate();
  const hospitals = getHospitals();

  const scrollToHospitals = () => {
    document.getElementById("hospitals-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">MediQueue</span>
          </div>
            <div />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Medical professionals" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/50" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Skip the Wait.
              <br />
              <span className="text-blue-400">Book & Track</span> Your Appointment.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              Book hospital appointments online and track your token in real time. Know exactly when
              your turn is — no more sitting in crowded waiting rooms.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={scrollToHospitals} className="gap-2 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                <CalendarCheck className="h-5 w-5" />
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/track")}
                className="gap-2 text-base border-white/20 text-white hover:bg-white/10 hover:text-white bg-white/5"
              >
                <Search className="h-5 w-5" />
                Track Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A simple 3-step process to book and track your hospital appointment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Select Hospital", desc: "Choose from our network of partner hospitals below." },
              { step: "2", title: "Book Appointment", desc: "Fill a quick form with your details and get your token instantly." },
              { step: "3", title: "Track Your Turn", desc: "See the live running token and know how many are ahead of you." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Why Choose MediQueue?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We make hospital visits hassle-free with modern appointment management
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full text-center hover:shadow-lg transition-all border-0 shadow-sm bg-white dark:bg-gray-900">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                    <f.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospitals */}
      <section id="hospitals-section" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Our Partner Hospitals
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Select a hospital to book an appointment or track your existing token
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {hospitals.map((hospital, i) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-all group border-0 shadow-sm bg-white dark:bg-gray-900"
                  onClick={() => navigate(`/hospital/${hospital.id}`)}
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={hospitalImages[hospital.id]}
                      alt={hospital.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">{hospital.name}</h3>
                    <div className="flex items-start gap-1.5 text-sm text-gray-500 mb-1">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{hospital.phone}</span>
                    </div>
                    <Button size="sm" className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm">
                      View & Book
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">MediQueue</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigate("/track")} className="text-xs text-gray-500 gap-1.5">
                <Search className="h-3.5 w-3.5" /> Track
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/reception")} className="text-xs text-gray-500 gap-1.5">
                <UserCheck className="h-3.5 w-3.5" /> Reception
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/superadmin")} className="text-xs text-gray-500 gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" /> Admin
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            © {new Date().getFullYear()} MediQueue. Smart Hospital Appointment Booking & Tracking System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HospitalSelect;
