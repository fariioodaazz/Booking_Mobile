import { gql } from '@apollo/client';

export const GET_COMPLETE_INVITED_BOOKING_DETAILS = gql`
  query GetCompleteInvitedBookingDetails($bookingId: ID!) {
    getInvitedBooking(bookingId: $bookingId) {
      id
      bookingDate
      status
      pendingTimestamp
      facility {
        id
        facilityType
        info
        category {
          id
          category
          name
        }
      }
      slot {
        id
        startTime
        endTime
        theHour
        date
        facility {
          id
        }
      }
      
      owner {
        id
        nuId
        name
      }
      
      participants {
        id
        isConfirmed
        expiresAt
        user {
          nuId
          name
        }
      }
    }
  }
`;
