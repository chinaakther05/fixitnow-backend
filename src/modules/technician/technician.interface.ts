export interface UpdateTechnicianProfilePayload {
  bio?: string;
  experience?: number;
  skills?: string[];
  hourlyRate?: number;
}

export interface UpdateAvailabilityPayload {
  availability: Record<string, any>;
}