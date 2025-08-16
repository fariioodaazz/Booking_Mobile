// app/api/user/queries.ts
import { gql } from "@apollo/client";

export const MY_INVOLVED_BOOKINGS_QUERY = gql`
  query MyInvolvedBookings($status: String, $role: RoleFilterEnum!) {
    myInvolvedBookings(status: $status, role: $role) {
      id
      status
      bookingDate
      facility { id info }
    slot { id theHour }
    isMine
    amIParticipant
    isCancellable
    owner{ id name }
    participants { user { id name } isConfirmed }
  }
}
`;
