import { gql } from '@apollo/client';

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      success
      message
      notification {
        id
        isRead
        title
      }
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllAsRead {
    markAllNotificationsAsRead {
      success
      message
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId) {
      success
      message
    }
  }
`;
