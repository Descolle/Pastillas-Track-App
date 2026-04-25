// =========================
// DATABASE TYPES - NEW SCHEMA
// =========================

export type IntakeStatus = 'taken' | 'missed' | 'late';
export type CaregiverStatus = 'pending' | 'accepted' | 'rejected';
export type PaymentStatus = 'active' | 'cancelled' | 'expired';

export interface Profile {
  id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  fecha_nacimiento?: string;
  genero?: string;
  plan: 'free' | 'pro';
  role: 'user' | 'admin';
  created_at: string;
  pro_expires_at?: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage?: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  user_id: string;
  medication_id: string;
  time: string;
  days_of_week: number[]; // 0=domingo, 6=sábado
  created_at: string;
}

export interface Intake {
  id: string;
  schedule_id: string;
  taken_at?: string;
  status: IntakeStatus;
  created_at: string;
}

export interface AdherenceHistory {
  id: string;
  user_id: string;
  date: string;
  total_medications: number;
  taken_medications: number;
  adherence_percentage: number;
  created_at: string;
}

export interface Caregiver {
  id: string;
  patient_id: string;
  caregiver_id: string;
  status: CaregiverStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  platform?: string;
  product_id?: string;
  transaction_id?: string;
  status: PaymentStatus;
  created_at: string;
}

// Combined types for UI
export interface Pastilla {
  id: string; // schedule_id
  nombre: string;
  cantidad: number;
  time: string;
  tomada: boolean;
  days_of_week: number[];
}
