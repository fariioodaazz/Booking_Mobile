// Queries
export {
  GET_MY_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS,
  GET_UNREAD_COUNT
} from './queries';

// Mutations
export {
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  DELETE_NOTIFICATION
} from './mutations';

// Hooks
export {
  useMyNotifications,
  useUnreadNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification
} from './hooks';

// Types
export type {
  Notification,
  NotificationRecipient,
  NotificationFacility,
  NotificationBooking,
  GetMyNotificationsResponse,
  GetUnreadNotificationsResponse,
  GetUnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
  DeleteNotificationResponse,
  MarkAsReadVariables,
  DeleteNotificationVariables
} from './types';
