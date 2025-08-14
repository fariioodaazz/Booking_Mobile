import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import {
  GET_MY_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS,
  GET_UNREAD_COUNT
} from './queries';
import {
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  DELETE_NOTIFICATION
} from './mutations';
import type {
  GetMyNotificationsResponse,
  GetUnreadNotificationsResponse,
  GetUnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
  DeleteNotificationResponse,
  MarkAsReadVariables,
  DeleteNotificationVariables
} from './types';

// Hook for getting all notifications
export const useMyNotifications = () => {
  return useQuery<GetMyNotificationsResponse>(
    GET_MY_NOTIFICATIONS,
    {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );
};

// Hook for getting unread notifications
export const useUnreadNotifications = () => {
  return useQuery<GetUnreadNotificationsResponse>(
    GET_UNREAD_NOTIFICATIONS,
    {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );
};

// Hook for getting unread count
export const useUnreadCount = () => {
  return useQuery<GetUnreadCountResponse>(
    GET_UNREAD_COUNT,
    {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );
};

// Hook for marking notification as read
export const useMarkAsRead = () => {
  const client = useApolloClient();
  
  const [markAsRead, { loading, error }] = useMutation<MarkAsReadResponse, MarkAsReadVariables>(
    MARK_NOTIFICATION_AS_READ,
    {
      onCompleted: () => {
        // Refetch notifications to update the cache
        client.refetchQueries({
          include: [GET_MY_NOTIFICATIONS, GET_UNREAD_NOTIFICATIONS, GET_UNREAD_COUNT]
        });
      }
    }
  );

  const markNotificationAsRead = (notificationId: string) => {
    return markAsRead({
      variables: { notificationId }
    });
  };

  return { markNotificationAsRead, loading, error };
};

// Hook for marking all notifications as read
export const useMarkAllAsRead = () => {
  const client = useApolloClient();
  
  const [markAllAsRead, { loading, error }] = useMutation<MarkAllAsReadResponse>(
    MARK_ALL_NOTIFICATIONS_AS_READ,
    {
      onCompleted: () => {
        // Refetch notifications to update the cache
        client.refetchQueries({
          include: [GET_MY_NOTIFICATIONS, GET_UNREAD_NOTIFICATIONS, GET_UNREAD_COUNT]
        });
      }
    }
  );

  return { markAllAsRead, loading, error };
};

// Hook for deleting notification
export const useDeleteNotification = () => {
  const client = useApolloClient();
  
  const [deleteNotification, { loading, error }] = useMutation<DeleteNotificationResponse, DeleteNotificationVariables>(
    DELETE_NOTIFICATION,
    {
      onCompleted: () => {
        // Refetch notifications to update the cache
        client.refetchQueries({
          include: [GET_MY_NOTIFICATIONS, GET_UNREAD_NOTIFICATIONS, GET_UNREAD_COUNT]
        });
      }
    }
  );

  const deleteNotificationById = (notificationId: string) => {
    return deleteNotification({
      variables: { notificationId }
    });
  };

  return { deleteNotificationById, loading, error };
};
