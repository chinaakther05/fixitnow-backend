export interface CreatePaymentPayload {
  bookingId: string;
}

export interface ConfirmPaymentPayload {
  transactionId: string;
}