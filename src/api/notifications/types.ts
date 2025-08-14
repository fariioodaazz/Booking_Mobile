export interface NotificationRecipient {
  name?: string;
  email: string;
}

export interface NotificationFacility {
  facilityType: string;
}

export interface NotificationBooking {
  id: string;
  facility: NotificationFacility;
  status: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isInfo: boolean;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  isExpired: boolean;
  timeRemaining?: string;
  relatedBookingId?: string;
  recipient: NotificationRecipient;
  relatedBooking?: NotificationBooking;
}

// Query Response Types
export interface GetMyNotificationsResponse {
  myNotifications: Notification[];
}

export interface GetUnreadNotificationsResponse {
  myNotifications: Notification[];
}

export interface GetUnreadCountResponse {
  unreadNotificationsCount: number;
}

// Mutation Response Types
export interface MarkAsReadResponse {
  markNotificationAsRead: {
    success: boolean;
    message: string;
    notification: {
      id: string;
      isRead: boolean;
      title: string;
    };
  };
}

export interface MarkAllAsReadResponse {
  markAllNotificationsAsRead: {
    success: boolean;
    message: string;
  };
}

export interface DeleteNotificationResponse {
  deleteNotification: {
    success: boolean;
    message: string;
  };
}

// Query Variables
export interface MarkAsReadVariables {
  notificationId: string;
}

export interface DeleteNotificationVariables {
  notificationId: string;
}
