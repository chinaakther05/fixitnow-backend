export interface CreateBookingPayload {
  technicianId: string;
  categoryId?: string;
  serviceId?: string;
  scheduledDate: string; 
  address?: string;
  notes?: string;
  totalAmount: number;
}

export interface UpdateBookingStatusPayload {
  status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}