import { gql } from "@apollo/client";

export const MY_BOOKINGS = gql`
  query MyBookings {
    myBookings {
      id
      facility { id }
      slot { id }
    }
  }
`;
