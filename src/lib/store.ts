import { Hospital, HospitalState, Appointment, Staff } from "./types";

const HOSPITALS: Hospital[] = [
  { id: "h1", name: "City General Hospital", address: "123 Main Street, Downtown", phone: "+1 555-0101", stateCode: "TG", shortCode: "CGH" },
  { id: "h2", name: "St. Mary's Medical Center", address: "456 Oak Avenue, Westside", phone: "+1 555-0102", stateCode: "AP", shortCode: "SMM" },
  { id: "h3", name: "Sunrise Health Clinic", address: "789 Pine Road, Eastside", phone: "+1 555-0103", stateCode: "KA", shortCode: "SHC" },
  { id: "h4", name: "Green Valley Hospital", address: "321 Elm Boulevard, Northside", phone: "+1 555-0104", stateCode: "MH", shortCode: "GVH" },
];

const ADMIN_CREDENTIALS = [
  { hospitalId: "h1", password: "hospital123" },
  { hospitalId: "h2", password: "hospital123" },
  { hospitalId: "h3", password: "hospital123" },
  { hospitalId: "h4", password: "hospital123" },
];

import { Doctor } from "./types";

const DOCTORS: Doctor[] = [
  { id: "d1", hospitalId: "h1", name: "Dr. A. Kumar", specialty: "General Medicine" },
  { id: "d2", hospitalId: "h1", name: "Dr. S. Rao", specialty: "ENT" },
  { id: "d3", hospitalId: "h1", name: "Dr. P. Sharma", specialty: "Orthopedics" },
  { id: "d4", hospitalId: "h2", name: "Dr. L. Fernandes", specialty: "Pediatrics" },
  { id: "d5", hospitalId: "h2", name: "Dr. R. Patel", specialty: "Dermatology" },
  { id: "d6", hospitalId: "h3", name: "Dr. M. Reddy", specialty: "Cardiology" },
  { id: "d7", hospitalId: "h3", name: "Dr. K. Singh", specialty: "General Medicine" },
  { id: "d8", hospitalId: "h4", name: "Dr. N. Gupta", specialty: "Neurology" },
  { id: "d9", hospitalId: "h4", name: "Dr. V. Iyer", specialty: "Ophthalmology" },
];
export function getDoctorsByHospital(hospitalId: string): Doctor[] {
  return DOCTORS.filter((d) => d.hospitalId === hospitalId);
}

const STAFF: Staff[] = [
  { id: "s1", hospitalId: "h1", name: "Reception - City Gen", role: "reception" },
  { id: "s2", hospitalId: "h2", name: "Reception - St. Mary's", role: "reception" },
  { id: "s3", hospitalId: "h3", name: "Reception - Sunrise", role: "reception" },
  { id: "s4", hospitalId: "h4", name: "Reception - Green Valley", role: "reception" },
];

function getStateKey(hospitalId: string) {
  return `hospital_state_${hospitalId}`;
}

function getDefaultState(): HospitalState {
  return { currentToken: 0, totalAppointments: 0, bookingEnabled: true, appointments: [] };
}

export function getHospitals(): Hospital[] {
  return HOSPITALS;
}

export function getHospital(id: string): Hospital | undefined {
  return HOSPITALS.find((h) => h.id === id);
}

export function getHospitalState(hospitalId: string): HospitalState {
  const raw = localStorage.getItem(getStateKey(hospitalId));
  if (!raw) return getDefaultState();
  const state: HospitalState = JSON.parse(raw);
  // Backfill tokenId for legacy appointments
  const hospital = HOSPITALS.find((h) => h.id === hospitalId);
  if (hospital) {
    let changed = false;
    for (const appt of state.appointments) {
      if (!appt.tokenId) {
        appt.tokenId = generateTokenId(hospital, appt.tokenNumber);
        changed = true;
      }
    }
    if (changed) localStorage.setItem(getStateKey(hospitalId), JSON.stringify(state));
  }
  return state;
}

function saveHospitalState(hospitalId: string, state: HospitalState) {
  localStorage.setItem(getStateKey(hospitalId), JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("hospital-state-changed", { detail: { hospitalId } }));
}

export function generateTokenId(hospital: Hospital, tokenNumber: number): string {
  return `${hospital.stateCode}-${hospital.shortCode}-${String(tokenNumber).padStart(4, "0")}`;
}

export function bookAppointment(
  hospitalId: string,
  data: { name: string; age: number; gender: "male" | "female" | "other"; place: string; phone: string; reason?: string },
  doctorId?: string
): Appointment {
  const state = getHospitalState(hospitalId);
  const hospital = getHospital(hospitalId)!;
  const tokenNumber = state.totalAppointments + 1;
  const tokenId = generateTokenId(hospital, tokenNumber);
  const appointment: Appointment = {
    id: `${hospitalId}_${tokenNumber}_${Date.now()}`,
    hospitalId,
    tokenNumber,
    tokenId,
    name: data.name,
    age: data.age,
    gender: data.gender,
    place: data.place,
    phone: data.phone,
    reason: data.reason,
    status: state.currentToken === 0 && tokenNumber === 1 ? "running" : "waiting",
    createdAt: new Date().toISOString(),
  };
  state.appointments.push(appointment);
  state.totalAppointments = tokenNumber;
  if (state.currentToken === 0) state.currentToken = 1;
  saveHospitalState(hospitalId, state);
  return appointment;
}

export function completeAppointment(hospitalId: string, tokenNumber: number) {
  const state = getHospitalState(hospitalId);
  const idx = state.appointments.findIndex((a) => a.tokenNumber === tokenNumber);
  if (idx === -1) return;
  state.appointments[idx].status = "completed";

  // Find next waiting
  const next = state.appointments.find((a) => a.status === "waiting");
  if (next) {
    next.status = "running";
    state.currentToken = next.tokenNumber;
  } else {
    state.currentToken = tokenNumber; // stay on last
  }
  saveHospitalState(hospitalId, state);
}

export function toggleBooking(hospitalId: string) {
  const state = getHospitalState(hospitalId);
  state.bookingEnabled = !state.bookingEnabled;
  saveHospitalState(hospitalId, state);
}

// Seed the hospital with some sample appointments if none exist.
export function seedSampleAppointments(hospitalId: string) {
  const state = getHospitalState(hospitalId);
  if (state.appointments.length > 0) return;

  const samples: Array<{ name: string; age: number; gender: 'male' | 'female' | 'other'; place: string; phone: string; reason?: string }> = [
    { name: 'John Doe', age: 34, gender: 'male', place: 'Downtown', phone: '+1 555-1001', reason: 'Checkup' },
    { name: 'Jane Smith', age: 28, gender: 'female', place: 'Westside', phone: '+1 555-1002', reason: 'Flu' },
    { name: 'Carlos Ruiz', age: 45, gender: 'male', place: 'Eastside', phone: '+1 555-1003', reason: 'Consultation' },
  ];

  // Use bookAppointment to create properly-formed appointments and persist state
  samples.forEach((s) => bookAppointment(hospitalId, s));
}


// Doctor management functions for SuperAdminPortal
export function getAllDoctors() {
  return DOCTORS;
}

export function addDoctor(hospitalId: string, name: string, specialty?: string) {
  const id = `d${Date.now()}`;
  const doctor: Doctor = { id, hospitalId, name, specialty };
  DOCTORS.push(doctor);
  return doctor;
}

export function removeDoctor(doctorId: string) {
  const idx = DOCTORS.findIndex((d) => d.id === doctorId);
  if (idx !== -1) {
    DOCTORS.splice(idx, 1);
    return true;
  }
  return false;
}

export function addStaff(hospitalId: string, name: string, role: Staff['role']): Staff {
  const id = `s${Date.now()}`;
  const staff: Staff = { id, hospitalId, name, role };
  STAFF.push(staff);
  return staff;
}

// Simple analytics helpers
export function getTotalBookings(hospitalId: string): number {
  return getHospitalState(hospitalId).totalAppointments;
}

// getBookingsByDoctor removed

export function getHospitalsCount() {
  return HOSPITALS.length;
}

export function validateAdmin(hospitalIdInput: string, password: string): string | null {
  const input = (hospitalIdInput || "").trim().toLowerCase();
  if (!input) return null;

  // Allow users to enter either the hospital id (e.g. h1) or the hospital name.
  const hospital = HOSPITALS.find(
    (h) => h.id.toLowerCase() === input || h.name.toLowerCase() === input
  );
  if (!hospital) return null;

  // Seed sample appointments for a better visual when logging in for the first time
  seedSampleAppointments(hospital.id);

  // Allow login even if password doesn't match (accept unrelated credentials)
  // Return the resolved hospital id so the app navigates to that hospital's dashboard.
  return hospital.id;
}

export function subscribeHospitalState(hospitalId: string | undefined, callback: () => void) {
  if (typeof window === "undefined" || !hospitalId) return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail.hospitalId === hospitalId) callback();
  };
  window.addEventListener("hospital-state-changed", handler);
  return () => window.removeEventListener("hospital-state-changed", handler);
}

// Doctor-specific queue operations removed

// ─── Super-admin helpers ────────────────────────────────────

export function addHospital(name: string, address: string, phone: string, stateCode?: string, shortCode?: string): Hospital {
  const id = `h${Date.now()}`;
  const sc = stateCode || name.substring(0, 2).toUpperCase();
  const shc = shortCode || name.split(/\s+/).map(w => w[0]).join("").toUpperCase().substring(0, 3);
  const hospital: Hospital = { id, name, address, phone, stateCode: sc, shortCode: shc };
  HOSPITALS.push(hospital);
  ADMIN_CREDENTIALS.push({ hospitalId: id, password: "hospital123" });
  return hospital;
}

export function getAllAnalytics() {
  return HOSPITALS.map((h) => {
    const state = getHospitalState(h.id);
    const doctors = getDoctorsByHospital(h.id);
    return {
      hospital: h,
      totalBookings: state.totalAppointments,
      active: state.appointments.filter((a) => a.status !== "completed").length,
      completed: state.appointments.filter((a) => a.status === "completed").length,
      bookingEnabled: state.bookingEnabled,
      doctorCount: doctors.length,
      todayBookings: state.appointments.filter(
        (a) => new Date(a.createdAt).toDateString() === new Date().toDateString()
      ).length,
    };
  });
}

// ─── Track appointment across all hospitals ─────────────────

export interface TrackedAppointment extends Appointment {
  hospitalName: string;
  doctorName?: string;
  currentToken: number;
  queuePosition: number;
}

export function trackAppointment(query: string): TrackedAppointment[] {
  const q = query.trim();
  if (!q) return [];

  const results: TrackedAppointment[] = [];

  for (const hospital of HOSPITALS) {
    const state = getHospitalState(hospital.id);
    const matches = state.appointments.filter((a) => {
      const tokenIdMatch = a.tokenId && a.tokenId.toUpperCase() === q.toUpperCase();
      const phoneMatch = a.phone.replace(/[\s\-\+\(\)]/g, "").includes(q.replace(/[\s\-\+\(\)]/g, ""));
      return tokenIdMatch || phoneMatch;
    });

    for (const appt of matches) {
      const doctor = DOCTORS.find((d) => d.id === appt.doctorId);
      const waitingAhead = appt.status === "waiting"
        ? state.appointments.filter((a) => a.doctorId === appt.doctorId && a.status === "waiting" && a.tokenNumber < appt.tokenNumber).length
        : 0;

      results.push({
        ...appt,
        hospitalName: hospital.name,
        doctorName: doctor?.name,
        currentToken: state.currentToken,
        queuePosition: appt.status === "waiting" ? waitingAhead + 1 : 0,
      });
    }
  }

  return results;
}
