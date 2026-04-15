export type PlanTier = "free" | "pro";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  plan_tier: PlanTier;
  stripe_customer_id: string | null;
  stripe_subscription_status: string | null;
  created_at: string;
  updated_at: string;
};

export type MedicationRecord = {
  id: string;
  user_id: string;
  nombre: string;
  cantidad: number;
  tiempo: string;
  tomada: boolean;
  notification_id: string | null;
  updated_at: string;
  created_at: string;
};

export type MedicationEventRecord = {
  id: string;
  user_id: string;
  medication_id: string;
  event_type: "taken" | "untaken";
  created_at: string;
};
