export interface NotificationRecipient {
  name: string;
  email: string;
}

export interface NotificationFacility {
  facilityType: string;
  info: string;
}

export interface NotificationSlot {
  theHour: string;
}

export interface NotificationBooking {
  id: string;
  facility: NotificationFacility;
  slot: NotificationSlot;
  status: string;
}

export interface MyNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  expiresAt?: string;
  isExpired: boolean;
  timeRemaining?: string;
  isRead: boolean;
  relatedBookingId?: string;
  recipient: NotificationRecipient;
  relatedBooking?: NotificationBooking;
}

export interface GetMyNotificationsResponse {
  myNotifications: MyNotification[];
}
