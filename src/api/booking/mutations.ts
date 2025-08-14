// Booking Mutations
// app/api/booking/mutations.ts
import { gql } from "@apollo/client";

export const CANCEL_BOOKING_MUTATION = gql`
  mutation CancelBooking($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      success
      message
    }
  }
`;

export const ACCEPT_BOOKING_INVITE = gql`
  mutation AcceptBookingInvite($bookingId: ID!) {
    acceptBookingInvite(bookingId: $bookingId) {
      success
      message
    }
  }
`;

export const DECLINE_BOOKING_INVITE = gql`
  mutation DeclineBookingInvite($bookingId: ID!) {
    declineBookingInvite(bookingId: $bookingId) {
      success
      message
    }
  }
`;