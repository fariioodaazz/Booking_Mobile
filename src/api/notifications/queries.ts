import { gql } from '@apollo/client';

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      id
      title
      message
      isRead
      isInfo
      createdAt
      expiresAt
      recipient {
        email
      }
      relatedBooking {
        id
        facility {
          facilityType
        }
        status
      }
    }
  }
`;

export const GET_UNREAD_NOTIFICATIONS = gql`
  query GetUnreadNotifications {
    myNotifications(includeRead: false) {
      id
      title
      message
      createdAt
      recipient {
        email
      }
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount {
    unreadNotificationsCount
  }
`;
