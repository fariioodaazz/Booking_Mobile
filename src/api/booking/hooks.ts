import { useQuery, useMutation } from '@apollo/client';
import { GET_COMPLETE_INVITED_BOOKING_DETAILS } from './queries';
import { ACCEPT_BOOKING_INVITE, DECLINE_BOOKING_INVITE } from './mutations';
import type { 
  GetCompleteInvitedBookingDetailsResponse, 
  GetCompleteInvitedBookingDetailsVariables,
  AcceptBookingInviteResponse,
  DeclineBookingInviteResponse,
  BookingActionVariables
} from './types';

export const useCompleteInvitedBookingDetails = (bookingId: string) => {
  return useQuery<GetCompleteInvitedBookingDetailsResponse, GetCompleteInvitedBookingDetailsVariables>(
    GET_COMPLETE_INVITED_BOOKING_DETAILS,
    {
      variables: { bookingId },
      skip: !bookingId,
      errorPolicy: 'all',
    }
  );
};

export const useAcceptBookingInvite = () => {
  const [acceptBookingInvite, { loading, error }] = useMutation<AcceptBookingInviteResponse, BookingActionVariables>(
    ACCEPT_BOOKING_INVITE
  );

  const handleAccept = async (bookingId: string) => {
    try {
      const result = await acceptBookingInvite({
        variables: { bookingId }
      });
      return result.data?.acceptBookingInvite;
    } catch (err) {
      console.error('Error accepting booking invite:', err);
      throw err;
    }
  };

  return {
    acceptBooking: handleAccept,
    loading,
    error
  };
};

export const useDeclineBookingInvite = () => {
  const [declineBookingInvite, { loading, error }] = useMutation<DeclineBookingInviteResponse, BookingActionVariables>(
    DECLINE_BOOKING_INVITE
  );

  const handleDecline = async (bookingId: string) => {
    try {
      const result = await declineBookingInvite({
        variables: { bookingId }
      });
      return result.data?.declineBookingInvite;
    } catch (err) {
      console.error('Error declining booking invite:', err);
      throw err;
    }
  };

  return {
    declineBooking: handleDecline,
    loading,
    error
  };
};


