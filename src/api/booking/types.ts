// Booking-related types
export type Booking = {
  id: string;
  status: string;
  bookingDate: string;
  pendingTimestamp?: string | null;
  isMine: boolean;
  amIParticipant: boolean;
  isCancellable: boolean;
  facility?: { id: string; info?: string | null };
  slot: { id: string; theHour: number };
  owner: { id: string; name: string };
  participants?: { isConfirmed: boolean; user: { id: string; name?: string } }[];
};

// Enhanced booking types for complete booking details
export type BookingCategory = {
  id: string;
  category: string;
  name: string;
};

export type BookingFacility = {
  id: string;
  facilityType: string;
  info: string;
  category: BookingCategory;
};

export type BookingSlot = {
  id: string;
  startTime: string;
  endTime: string;
  theHour: number;
  date: string;
  facility: {
    id: string;
  };
};

export type BookingOwner = {
  id: string;
  nuId: string;
  name: string;
};

export type BookingParticipant = {
  id: string;
  isConfirmed: boolean;
  expiresAt: string;
  user: {
    nuId: string;
    name: string;
  };
};

export type CompleteBookingDetails = {
  id: string;
  bookingDate: string;
  status: string;
  pendingTimestamp?: string | null;
  facility: BookingFacility;
  slot: BookingSlot;
  owner: BookingOwner;
  participants: BookingParticipant[];
};

// Query response types
export type GetCompleteInvitedBookingDetailsResponse = {
  getInvitedBooking: CompleteBookingDetails;
};

export type GetCompleteInvitedBookingDetailsVariables = {
  bookingId: string;
};

// Accept/Decline Booking Mutation Types
export type BookingActionResponse = {
  success: boolean;
  message: string;
};

export type AcceptBookingInviteResponse = {
  acceptBookingInvite: BookingActionResponse;
};

export type DeclineBookingInviteResponse = {
  declineBookingInvite: BookingActionResponse;
};

export type BookingActionVariables = {
  bookingId: string;
};