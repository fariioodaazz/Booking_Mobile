// app/api/user/queries.ts
import { gql } from "@apollo/client";

export const MY_BOOKINGS_QUERY = gql`
  query MyBookings {
    myBookings {
      id
      status
      bookingDate
      pendingTimestamp
      isCancellable
      facility { id info }
      slot { id theHour }
      participants {
        id
        isConfirmed
        user { id name }
      }
    }
  }
`;

