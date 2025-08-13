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