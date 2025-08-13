// Booking-related types
export type Booking = {
  id: string;
  status: string;                     
  bookingDate: string;
  pendingTimestamp?: string | null;
  isCancellable?: boolean | null;
  facility: { id: string; info: string };
  slot: { id: string; theHour: number };
  participants?: Array<{
    id: string;
    isConfirmed: boolean;
    user: { id: string; name: string };
  }>;
};