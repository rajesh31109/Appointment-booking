export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  stateCode: string;
  shortCode: string;
}

export interface Appointment {
  id: string;
  hospitalId: string;
  doctorId?: string;
  tokenNumber: number;
  tokenId: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  place: string;
  phone: string;
  reason?: string;
  status: "waiting" | "running" | "completed";
  createdAt: string;
}

export interface HospitalState {
  currentToken: number;
  totalAppointments: number;
  bookingEnabled: boolean;
  appointments: Appointment[];
}

export interface Doctor {
  id: string;
  hospitalId: string;
  name: string;
  specialty?: string;
}

export interface Staff {
  id: string;
  hospitalId: string;
  name: string;
  role: "reception" | "doctor" | "admin";
}
