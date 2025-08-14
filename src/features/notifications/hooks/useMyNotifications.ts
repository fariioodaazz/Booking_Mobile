import { useQuery } from '@apollo/client';
import { GET_MY_NOTIFICATIONS } from '../graphql/queries.gql';
import { GetMyNotificationsResponse } from '../types';

export const useMyNotifications = () => {
  const { data, loading, error, refetch } = useQuery<GetMyNotificationsResponse>(
    GET_MY_NOTIFICATIONS,
    {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );

  return {
    notifications: data?.myNotifications || [],
    loading,
    error,
    refetch
  };
};
