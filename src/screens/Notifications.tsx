import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  View
} from 'react-native';
import styled from 'styled-components/native';
import { 
  Bell, 
  Check, 
  X, 
  Users, 
  Trash2,
  ChevronLeft
} from 'lucide-react-native';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  useMyNotifications, 
  useMarkAsRead, 
  useMarkAllAsRead, 
  useDeleteNotification,
  type Notification as MyNotification 
} from '../api/notifications';

interface NotificationsProps {
  onBack?: () => void;
  onNotificationPress?: (notification: MyNotification) => void;
}

// Styled component prop interfaces
interface NotificationCardProps {
  isRead: boolean;
  isNew?: boolean;
}

interface NotificationTitleProps {
  isRead: boolean;
}

// Styled Components - Following FriendInvitation design patterns
const Container = styled(ScrollView)`
  flex: 1;
  background-color: #ffffff;
  padding: 8px;
`;

const MaxWidthContainer = styled.View`
  max-width: 384px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderContainer = styled.View`
  margin-bottom: 16px;
  padding-top: 15px;
`;

const Title = styled.Text`
  color: #007AFF;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: 16px;
`;

const TabsContainer = styled.View`
  margin-bottom: 16px;
`;

const SectionContainer = styled.View`
  margin-bottom: 16px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const SectionTitle = styled.Text`
  color: #1f2937;
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
`;

const CardContainer = styled.TouchableOpacity<NotificationCardProps>`
  background-color: ${(props: NotificationCardProps) => props.isRead ? '#ffffff' : '#f0f8ff'};
  border-radius: 12px;
  padding: 12px;
  border-width: ${(props: NotificationCardProps) => props.isNew ? '2px' : '1px'};
  border-color: ${(props: NotificationCardProps) => props.isNew ? '#007AFF' : '#e5e7eb'};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
  margin-bottom: 6px;
  position: relative;
`;

const ListItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const NotificationInfo = styled.View`
  flex: 1;
`;

const NotificationTitle = styled.Text<NotificationTitleProps>`
  font-size: 16px;
  font-weight: 500;
  color: ${(props: NotificationTitleProps) => props.isRead ? '#6b7280' : '#1f2937'};
  margin-bottom: 2px;
`;

const NotificationMessage = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const NotificationTime = styled.Text`
  font-size: 12px;
  color: #9ca3af;
`;

const SpacedContainer = styled.View`
  gap: 8px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const BadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #f3f4f6;
  margin-bottom: 16px;
`;

const BackButtonText = styled.Text`
  color: #007AFF;
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
`;

const ActionableBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 122, 255, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  margin-top: 4px;
  align-self: flex-start;
  gap: 4px;
`;

const NewBadge = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #007AFF;
`;

const QuickActionCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
  margin-bottom: 16px;
`;

const QuickActionTitle = styled.Text`
  color: #1f2937;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const QuickActionsRow = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const QuickActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #007AFF;
  padding: 12px 24px;
  border-radius: 12px;
  gap: 8px;
`;

const QuickActionButtonText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const EmptyStateTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #1f2937;
  text-align: center;
  margin-bottom: 8px;
`;

const EmptyStateDescription = styled.Text`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: #6b7280;
  margin-top: 16px;
`;

// Main Notifications component
export function Notifications({ onBack, onNotificationPress }: NotificationsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { data, loading, error, refetch } = useMyNotifications();
  const { markNotificationAsRead } = useMarkAsRead();
  const { markAllAsRead } = useMarkAllAsRead();
  const { deleteNotificationById } = useDeleteNotification();
  const [refreshing, setRefreshing] = useState(false);

  const notifications = data?.myNotifications || [];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    }
    setRefreshing(false);
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter((n: MyNotification) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n: MyNotification) => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNotificationById(notificationId);
            } catch (error) {
              console.error('Error deleting notification:', error);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getNotificationTypeIcon = (notification: MyNotification) => {
    if (notification.isInfo) {
      return <Bell size={20} color="#6b7280" />;
    }
    
    if (notification.relatedBooking) {
      switch (notification.relatedBooking.status.toLowerCase()) {
        case 'confirmed':
          return <Check size={20} color="#10b981" />;
        case 'cancelled':
          return <X size={20} color="#ef4444" />;
        default:
          return <Users size={20} color="#007AFF" />;
      }
    }
    return <Bell size={20} color="#007AFF" />;
  };

  const isNotificationExpired = (notification: MyNotification) => {
    if (!notification.expiresAt) return false;
    return new Date(notification.expiresAt) < new Date();
  };

  const renderNotification = (notification: MyNotification) => {
    const isExpired = isNotificationExpired(notification);
    
    return (
      <CardContainer
        key={notification.id}
        isRead={notification.isRead || isExpired}
        isNew={!notification.isRead && !isExpired}
        onPress={() => {
          if (!notification.isRead) {
            handleMarkAsRead(notification.id);
          }
          
          if (!isExpired && !notification.isInfo) {
            onNotificationPress?.(notification);
          }
        }}
        style={isExpired ? { opacity: 0.5 } : undefined}
      >
        {!notification.isRead && <NewBadge />}
        
        <ListItemContainer>
          <View style={{ 
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f0f8ff',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getNotificationTypeIcon(notification)}
          </View>
          
          <NotificationInfo>
            <NotificationTitle isRead={notification.isRead || isExpired}>
              {notification.title}
              {isExpired && <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '500' }}> (Expired)</Text>}
            </NotificationTitle>
            <NotificationMessage>
              {notification.message}
            </NotificationMessage>
            
            {notification.relatedBooking && !notification.isInfo && !isExpired && (
              <ActionableBadge>
                <Text style={{ color: '#007AFF', fontSize: 12, fontWeight: '500' }}>
                  Tap to respond
                </Text>
                <ChevronLeft size={14} color="#007AFF" style={{ transform: [{ rotate: '180deg' }] }} />
              </ActionableBadge>
            )}
            
            {isExpired && notification.relatedBooking && !notification.isInfo && (
              <ActionableBadge style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '500' }}>
                  Expired
                </Text>
                <X size={14} color="#ef4444" />
              </ActionableBadge>
            )}
            
            <NotificationTime>
              {formatDate(notification.createdAt)}
              {notification.expiresAt && !isExpired && (
                <Text style={{ color: '#f59e0b' }}> • Expires {formatDate(notification.expiresAt)}</Text>
              )}
              {isExpired && (
                <Text style={{ color: '#ef4444' }}> • Expired {formatDate(notification.expiresAt!)}</Text>
              )}
            </NotificationTime>
          </NotificationInfo>
          
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteNotification(notification.id);
            }}
            style={{
              padding: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </ListItemContainer>
      </CardContainer>
    );
  };

  if (loading) {
    return (
      <Container contentContainerStyle={{ paddingBottom: 40 }}>
        <MaxWidthContainer>
          <LoadingContainer>
            <Text style={{ textAlign: 'center', padding: 20 }}>Loading notifications...</Text>
          </LoadingContainer>
        </MaxWidthContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container contentContainerStyle={{ paddingBottom: 40 }}>
        <MaxWidthContainer>
          <Text style={{ textAlign: 'center', padding: 20, color: 'red' }}>
            Error loading notifications: {error.message}
          </Text>
        </MaxWidthContainer>
      </Container>
    );
  }

  return (
    <Container 
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <MaxWidthContainer>
        {/* Header */}
        <HeaderContainer>
          <BackButton onPress={onBack}>
            <ChevronLeft size={16} color="#007AFF" />
            <BackButtonText>Back</BackButtonText>
          </BackButton>
          <Title>Notifications</Title>
          <Subtitle>Stay updated with your latest activities</Subtitle>
        </HeaderContainer>

        {/* Quick Actions */}
        {unreadCount > 0 && (
          <QuickActionCard>
            <QuickActionTitle>Quick Actions</QuickActionTitle>
            <QuickActionsRow>
              <QuickActionButton onPress={handleMarkAllAsRead}>
                <Check size={20} color="#ffffff" />
                <QuickActionButtonText>Mark All Read</QuickActionButtonText>
              </QuickActionButton>
            </QuickActionsRow>
          </QuickActionCard>
        )}

        <TabsContainer>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'unread')}>
            <TabsList>
              <TabsTrigger value="all">
                All Notifications
              </TabsTrigger>
              <TabsTrigger value="unread">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text>Unread</Text>
                  {unreadCount > 0 && (
                    <Badge variant="secondary">
                      <BadgeContainer>
                        <Text>{unreadCount}</Text>
                      </BadgeContainer>
                    </Badge>
                  )}
                </View>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <SpacedContainer>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(renderNotification)
                ) : (
                  <EmptyState>
                    <View style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 40, 
                      backgroundColor: '#f3f4f6', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: 16 
                    }}>
                      <Bell size={32} color="#6b7280" />
                    </View>
                    <EmptyStateTitle>
                      {activeTab === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
                    </EmptyStateTitle>
                    <EmptyStateDescription>
                      {activeTab === 'unread' 
                        ? 'All caught up! You have no unread notifications.' 
                        : 'You have no notifications yet. They will appear here when you receive them.'
                      }
                    </EmptyStateDescription>
                  </EmptyState>
                )}
              </SpacedContainer>
            </TabsContent>
          </Tabs>
        </TabsContainer>
      </MaxWidthContainer>
    </Container>
  );
}
