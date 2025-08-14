import { gql } from '@apollo/client';

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      id
      title
      message
      createdAt
      expiresAt
      isExpired
      timeRemaining
      isRead
      relatedBookingId
      recipient {
        name
        email
      }
      relatedBooking {
        id
        facility {
          facilityType
          info
        }
        slot {
          theHour
        }
        status
      }
    }
  }
`;
