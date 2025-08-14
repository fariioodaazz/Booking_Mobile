import { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Avatar } from '../components/ui/avatar';
import { Calendar, Clock, MapPin, Users, Check, X, User } from 'lucide-react-native';
import { 
  useCompleteInvitedBookingDetails, 
  useAcceptBookingInvite, 
  useDeclineBookingInvite 
} from '../api/booking';

// Styled component prop interfaces
interface IconCircleProps {
  backgroundColor?: string;
}

interface TitleProps {
  color?: string;
}

interface BadgeProps {
  backgroundColor?: string;
  borderColor?: string;
}

interface BadgeTextProps {
  color?: string;
}

interface ActionButtonProps {
  variant: 'primary' | 'outline';
}

interface ActionButtonTextProps {
  variant: 'primary' | 'outline';
}

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const BottomSection = styled.View`
  padding: 16px;
  padding-bottom: 32px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #f3f4f6;
`;

const MaxWidthContainer = styled.View`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding-horizontal: 4px;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
  padding-horizontal: 16px;
`;

const IconCircle = styled.View<IconCircleProps>`
  width: 64px;
  height: 64px;
  background-color: ${(props: IconCircleProps) => props.backgroundColor || '#007AFF'};
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const Title = styled.Text<TitleProps>`
  color: ${(props: TitleProps) => props.color || '#007AFF'};
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
  line-height: 28px;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: 15px;
  text-align: center;
  line-height: 20px;
  padding-horizontal: 16px;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

const CardPadding = styled.View`
  padding: 16px;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const CardTitle = styled.Text`
  color: #1f2937;
  font-size: 16px;
  font-weight: 500;
`;

const OrganizerRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const OrganizerInfo = styled.View`
  flex: 1;
`;

const OrganizerName = styled.Text`
  color: #1f2937;
  font-size: 16px;
  font-weight: 500;
`;

const Username = styled.Text`
  color: #6b7280;
  font-size: 14px;
`;

const Badge = styled.View<BadgeProps>`
  background-color: ${(props: BadgeProps) => props.backgroundColor || '#007AFF20'};
  border-width: 1px;
  border-color: ${(props: BadgeProps) => props.borderColor || '#007AFF40'};
  border-radius: 16px;
  padding-horizontal: 12px;
  padding-vertical: 4px;
`;

const BadgeText = styled.Text<BadgeTextProps>`
  color: ${(props: BadgeTextProps) => props.color || '#007AFF'};
  font-size: 12px;
  font-weight: 500;
`;

const CourtImage = styled.Image`
  width: 100%;
  height: 128px;
  border-radius: 12px 12px 0 0;
`;

const CourtHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CourtName = styled.Text`
  color: #1f2937;
  font-size: 16px;
  font-weight: 500;
  flex: 1;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LocationText = styled.Text`
  color: #6b7280;
  font-size: 14px;
  margin-left: 4px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const DetailInfo = styled.View`
  flex: 1;
`;

const DetailLabel = styled.Text`
  color: #1f2937;
  font-size: 16px;
  font-weight: 500;
`;

const DetailSubtext = styled.Text`
  color: #6b7280;
  font-size: 14px;
`;

const PlayerRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const PlayerInfo = styled.View`
  flex: 1;
`;

const PlayerName = styled.Text`
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
`;

const PlayerUsername = styled.Text`
  color: #6b7280;
  font-size: 12px;
`;

const NoteCard = styled.View`
  background-color: #007AFF10;
  border-width: 1px;
  border-color: #007AFF40;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const NoteTitle = styled.Text`
  color: #007AFF;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const NoteText = styled.Text`
  color: #6b7280;
  font-size: 14px;
`;

const ActionContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  padding-top: 8px;
`;

const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  flex: 1;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props: ActionButtonProps) => props.variant === 'primary' ? '#007AFF' : '#ffffff'};
  border-width: 1px;
  border-color: ${(props: ActionButtonProps) => props.variant === 'primary' ? '#007AFF' : '#ef4444'};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: ActionButtonProps) => props.variant === 'primary' ? 0.25 : 0.1};
  shadow-radius: 3.84px;
  elevation: ${(props: ActionButtonProps) => props.variant === 'primary' ? 5 : 2};
`;

const ActionButtonText = styled.Text<ActionButtonTextProps>`
  color: ${(props: ActionButtonTextProps) => props.variant === 'primary' ? '#ffffff' : '#ef4444'};
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 12px 24px;
  border-radius: 8px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const CloseButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
`;

interface NotificationResponseProps {
  bookingId: string;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export function NotificationResponse({ bookingId, onAccept, onDecline, onClose }: NotificationResponseProps) {
  const [hasResponded, setHasResponded] = useState(false);
  const [response, setResponse] = useState<'accepted' | 'declined' | null>(null);
  
  // Use the hooks
  const { data, loading, error } = useCompleteInvitedBookingDetails(bookingId);
  const { acceptBooking, loading: acceptLoading } = useAcceptBookingInvite();
  const { declineBooking, loading: declineLoading } = useDeclineBookingInvite();
  const bookingData = data?.getInvitedBooking;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    // Convert time like "14:00" to "2:00 PM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleAccept = async () => {
    try {
      const result = await acceptBooking(bookingId);
      if (result?.success) {
        setHasResponded(true);
        setResponse('accepted');
        Alert.alert('Success', result.message || 'Booking invitation accepted successfully!');
        onAccept();
      } else {
        Alert.alert('Error', result?.message || 'Failed to accept booking invitation');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      Alert.alert('Error', 'Failed to accept booking invitation. Please try again.');
    }
  };

  const handleDecline = async () => {
    try {
      const result = await declineBooking(bookingId);
      if (result?.success) {
        setHasResponded(true);
        setResponse('declined');
        Alert.alert('Success', result.message || 'Booking invitation declined successfully!');
        onDecline();
      } else {
        Alert.alert('Error', result?.message || 'Failed to decline booking invitation');
      }
    } catch (error) {
      console.error('Error declining booking:', error);
      Alert.alert('Error', 'Failed to decline booking invitation. Please try again.');
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <Container>
        <ScrollContent contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <MaxWidthContainer>
            <HeaderContainer style={{ paddingVertical: 64 }}>
              <Text style={{ textAlign: 'center', fontSize: 16, color: '#6b7280' }}>
                Loading booking details...
              </Text>
            </HeaderContainer>
          </MaxWidthContainer>
        </ScrollContent>
      </Container>
    );
  }

  // Handle error state
  if (error || !bookingData) {
    return (
      <Container>
        <ScrollContent contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <MaxWidthContainer>
            <HeaderContainer style={{ paddingVertical: 64 }}>
              <Text style={{ textAlign: 'center', fontSize: 16, color: '#ef4444' }}>
                Error loading booking details
              </Text>
              <TouchableOpacity onPress={onClose} style={{ marginTop: 16 }}>
                <Text style={{ textAlign: 'center', fontSize: 16, color: '#007AFF' }}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </HeaderContainer>
          </MaxWidthContainer>
        </ScrollContent>
      </Container>
    );
  }

  const totalPlayers = 1 + bookingData.participants.length;

  if (hasResponded) {
    return (
      <Container>
        <ScrollContent contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <MaxWidthContainer>
            <HeaderContainer style={{ paddingVertical: 64 }}>
              <IconCircle backgroundColor={response === 'accepted' ? '#10b981' : '#ef4444'}>
                {response === 'accepted' ? (
                  <Check size={32} color="#ffffff" />
                ) : (
                  <X size={32} color="#ffffff" />
                )}
              </IconCircle>
              <Title color={response === 'accepted' ? '#059669' : '#dc2626'}>
                {response === 'accepted' ? 'Invitation Accepted!' : 'Invitation Declined'}
              </Title>
              <Subtitle style={{ marginBottom: 24 }}>
                {response === 'accepted' 
                  ? 'Your response has been sent to the organizer.'
                  : 'Your decline has been noted.'
                }
              </Subtitle>
              <CloseButton onPress={onClose}>
                <CloseButtonText>Close</CloseButtonText>
              </CloseButton>
            </HeaderContainer>
          </MaxWidthContainer>
        </ScrollContent>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollContent contentContainerStyle={{ paddingBottom: 20 }}>
        <MaxWidthContainer>
          {/* Header */}
          <HeaderContainer>
            <IconCircle>
              <Users size={32} color="#ffffff" />
            </IconCircle>
            <Title>You're Invited!</Title>
            <Subtitle>Join a sports booking</Subtitle>
          </HeaderContainer>

        {/* Organizer */}
        <Card>
          <CardPadding>
            <CardHeader>
              <User size={16} color="#007AFF" />
              <CardTitle>Organized by</CardTitle>
            </CardHeader>
            <OrganizerRow>
              <Avatar 
                size={48}
                source={undefined}
                fallback={bookingData.owner.name.split(' ').map((n: string) => n[0]).join('')}
              />
              <OrganizerInfo>
                <OrganizerName>{bookingData.owner.name}</OrganizerName>
                <Username>{bookingData.owner.nuId}</Username>
              </OrganizerInfo>
              <Badge>
                <BadgeText>Host</BadgeText>
              </Badge>
            </OrganizerRow>
          </CardPadding>
        </Card>

        {/* Court Details */}
        <Card>
          <CardPadding>
            <CourtHeader>
              <CourtName>{bookingData.facility.category.name}</CourtName>
              <Badge backgroundColor="#007AFF20" borderColor="#007AFF40">
                <BadgeText>{bookingData.facility.facilityType}</BadgeText>
              </Badge>
            </CourtHeader>
            <LocationRow>
              <MapPin size={14} color="#007AFF" />
              <LocationText>{bookingData.facility.info}</LocationText>
            </LocationRow>
          </CardPadding>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardPadding>
            <CardTitle style={{ marginBottom: 16 }}>Booking Details</CardTitle>
            
            <DetailRow>
              <Calendar size={16} color="#007AFF" />
              <DetailInfo>
                <DetailLabel>{formatDate(bookingData.bookingDate)}</DetailLabel>
              </DetailInfo>
            </DetailRow>
            
            <DetailRow>
              <Clock size={16} color="#007AFF" />
              <DetailInfo>
                <DetailLabel>{formatTime(bookingData.slot.startTime)} - {formatTime(bookingData.slot.endTime)}</DetailLabel>
                <DetailSubtext>1 hour session</DetailSubtext>
              </DetailInfo>
            </DetailRow>

            <DetailRow style={{ marginBottom: 0 }}>
              <Users size={16} color="#007AFF" />
              <DetailInfo>
                <DetailLabel>{totalPlayers} {totalPlayers === 1 ? 'player' : 'players'} total</DetailLabel>
                <DetailSubtext>
                  {bookingData.owner.name} + {bookingData.participants.length} invited
                </DetailSubtext>
              </DetailInfo>
            </DetailRow>
          </CardPadding>
        </Card>

        {/* All Invited Players */}
        <Card>
          <CardPadding>
            <CardTitle style={{ marginBottom: 16 }}>All Players</CardTitle>
            
            {/* Organizer */}
            <PlayerRow>
              <Avatar 
                size={32}
                source={undefined}
                fallback={bookingData.owner.name.split(' ').map((n: string) => n[0]).join('')}
              />
              <PlayerInfo>
                <PlayerName>{bookingData.owner.name}</PlayerName>
                <PlayerUsername>{bookingData.owner.nuId}</PlayerUsername>
              </PlayerInfo>
              <Badge backgroundColor="#007AFF">
                <BadgeText color="#ffffff">Host</BadgeText>
              </Badge>
            </PlayerRow>

            {/* Invited Participants */}
            {bookingData.participants.map((participant, index) => (
              <PlayerRow key={participant.id} style={{ marginBottom: index === bookingData.participants.length - 1 ? 0 : 12 }}>
                <Avatar 
                  size={32}
                  source={undefined}
                  fallback={participant.user.name.split(' ').map((n: string) => n[0]).join('')}
                />
                <PlayerInfo>
                  <PlayerName>{participant.user.name}</PlayerName>
                  <PlayerUsername>{participant.user.nuId}</PlayerUsername>
                </PlayerInfo>
                <Badge backgroundColor={participant.isConfirmed ? "#10b981" : "#ffffff"} borderColor={participant.isConfirmed ? "#10b981" : "#007AFF60"}>
                  <BadgeText color={participant.isConfirmed ? "#ffffff" : "#1f2937"}>
                    {participant.isConfirmed ? 'Confirmed' : 'Invited'}
                  </BadgeText>
                </Badge>
              </PlayerRow>
            ))}
          </CardPadding>
        </Card>

        {/* Important Note */}
        <NoteCard>
          <NoteTitle>⏰ Time Sensitive</NoteTitle>
          <NoteText>
            At least 50% of invited friends need to accept within 30 minutes for this booking to be confirmed.
          </NoteText>
        </NoteCard>
      </MaxWidthContainer>
    </ScrollContent>

    {/* Fixed Action Buttons at Bottom */}
    <BottomSection>
      <MaxWidthContainer>
        <ActionContainer>
          <ActionButton 
            variant="outline" 
            onPress={handleDecline}
            style={{ 
              opacity: (acceptLoading || declineLoading) ? 0.5 : 1 
            }}
            disabled={acceptLoading || declineLoading}
          >
            <X size={16} color="#ef4444" />
            <ActionButtonText variant="outline">
              {declineLoading ? 'Declining...' : 'Decline'}
            </ActionButtonText>
          </ActionButton>
          <ActionButton 
            variant="primary" 
            onPress={handleAccept}
            style={{ 
              opacity: (acceptLoading || declineLoading) ? 0.5 : 1 
            }}
            disabled={acceptLoading || declineLoading}
          >
            <Check size={16} color="#ffffff" />
            <ActionButtonText variant="primary">
              {acceptLoading ? 'Accepting...' : 'Accept & Join'}
            </ActionButtonText>
          </ActionButton>
        </ActionContainer>
      </MaxWidthContainer>
    </BottomSection>
  </Container>
  );
}