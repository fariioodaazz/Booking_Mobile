// FriendsInvitation.tsx
import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useQuery,useMutation } from '@apollo/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SimpleQuickListManager } from '../components/ui/SimpleQuickListManager';
import { UserPlus, User, Zap, ArrowLeft, ArrowRight, Users, X, Search } from 'lucide-react-native';
import { GET_MY_QUICK_LISTS } from '../api/quicklist/queries';
import { DELETE_QUICK_LIST,CREATE_QUICK_LIST,UPDATE_QUICK_LIST,SEARCH_USER_BY_NU_ID  } from '../api/quicklist/mutations';
import type { QuickList as ApiQuickList } from '../api/quicklist/types';
import { ProgressIndicator } from '../components/ui/ProgressBar';

type Route = "home" | "regulations" | "friendInvitation";

const steps = [
  { number: 1, completed: true },
  { number: 2, completed: true },
  { number: 3, active: true },
  { number: 4 },
];

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

const CardContainer = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
  margin-bottom: 6px;
`;

const FormRow = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const InputContainer = styled.View`
  flex: 1;
  position: relative;
`;

const IconContainer = styled.View`
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  z-index: 1;
  align-items: center;
  justify-content: center;
  width: 20px;
`;

const ListItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const AvatarGroup = styled.View`
  flex-direction: row;
  margin-left: -4px;
`;

const AvatarContainer = styled.View`
  margin-left: -4px;
`;

const AvatarOverflow = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #007AFF20;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #ffffff;
  margin-left: -4px;
`;

const AvatarOverflowText = styled.Text`
  font-size: 10px;
  color: #007AFF;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
`;

const Username = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;

const QuickListInfo = styled.View`
  flex: 1;
`;

const QuickListName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
`;

const QuickListCount = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const NavigationContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  padding-top: 16px;
  padding-bottom: 20px;
  margin-top: 8px;
`;

const BadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
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

const Label = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
  gap: 8px;
`;

const LabelText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
`;

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface QuickList {
  id: string;
  name: string;
  friends: Friend[];
}

interface FriendInvitationProps {
  invitedFriends: Friend[];
  quickLists: QuickList[];
  onAddFriend: (friend: Friend) => void;
  onRemoveFriend: (friendId: string) => void;
  onAddQuickList: (friends: Friend[]) => void;
  onCreateQuickList: (list: Omit<QuickList, 'id'>) => void;
  onUpdateQuickList: (listId: string, list: Omit<QuickList, 'id'>) => void;
  onDeleteQuickList: (listId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function FriendInvitation({
  invitedFriends,
  quickLists,
  onAddFriend,
  onRemoveFriend,
  onAddQuickList,
  onCreateQuickList,
  onUpdateQuickList,
  onDeleteQuickList,
  onBack,
  onNext
}: FriendInvitationProps) {
  const [friendId, setFriendId] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { refetch: searchUser } = useQuery(SEARCH_USER_BY_NU_ID, { skip: true });

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((id: string) => {
      if (id.trim()) {
        setSearching(true);
        setSearchError(null);
        searchUser({ nuId: parseInt(id) })
          .then(res => {
            setSearching(false);
            const users = res.data?.searchUserByNuId || [];
            if (users.length === 0) {
              setSearchError('No users found');
              setSearchResults([]);
              return;
            }
            setSearchResults(users);
          })
          .catch(() => {
            setSearching(false);
            setSearchError('Error searching user');
            setSearchResults([]);
          });
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    }, 400)
  ).current;

  useEffect(() => {
    debouncedSearch(friendId);
    return () => {
      debouncedSearch.cancel();
    };
  }, [friendId]);

  const handleAddQuickListFriends = (list: QuickList) => {
    const newFriends = list.friends.filter(
      friend => !invitedFriends.find(invited => invited.id === friend.id)
    );
    onAddQuickList(newFriends);
  };

  return (
    <Container contentContainerStyle={{ paddingBottom: 40 }}>
      <MaxWidthContainer>
        {/* Header */}
        <HeaderContainer>
          <ProgressIndicator steps={steps} />
          <Title>Invite Friends</Title>
          <Subtitle>Add friends to join your game</Subtitle>
        </HeaderContainer>

        <TabsContainer>
          <Tabs defaultValue="invite">
            <TabsList>
              <TabsTrigger value="invite">
                Invite Friends
              </TabsTrigger>
              <TabsTrigger value="quicklists">
                QuickLists
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="invite">
              <SpacedContainer>
                {/* Add Friend by ID */}
                <CardContainer>
                  <Label>
                    <UserPlus size={16} color="#007AFF" />
                    <LabelText>Add Friend by NU ID</LabelText>
                  </Label>
                  <View style={{ marginBottom: 8 }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      backgroundColor: '#ffffff',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#e1e5e9',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      flex: 1,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}>
                      <Search size={20} color="#007AFF" style={{ marginRight: 12 }} />
                      <Input
                        placeholder="Enter NU ID to search..."
                        value={friendId}
                        onChangeText={(text: string) => setFriendId(text)}
                        style={{ 
                          flex: 1, 
                          borderWidth: 0, 
                          backgroundColor: 'transparent',
                          paddingHorizontal: 0,
                          paddingVertical: 0,
                          fontSize: 16,
                          color: '#1f2937'
                        }}
                      />
                      {searching && (
                        <View style={{ 
                          marginLeft: 12,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          backgroundColor: '#f0f9ff',
                          borderRadius: 6
                        }}>
                          <Text style={{ color: '#0369a1', fontSize: 12, fontWeight: '500' }}>Searching...</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {searchError && (
                    <Text style={{ color: 'red', marginTop: 4 }}>{searchError}</Text>
                  )}
                  {searchResults.length > 0 && (
                    <View style={{ 
                      marginTop: 12, 
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      padding: 12
                    }}>
                      <Text style={{ fontWeight: '500', marginBottom: 8, color: '#374151' }}>
                        Found {searchResults.length} user{searchResults.length > 1 ? 's' : ''}
                      </Text>
                      {searchResults.map((user: any) => (
                        <View key={user.nuId} style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          marginBottom: 8,
                          padding: 8,
                          backgroundColor: '#f9fafb',
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: '#e5e7eb'
                        }}>
                          <Avatar
                            size={32}
                            source={null}
                            defaultImage={require('../../assets/default_pic.jpg')}
                            fallback={user.name.split(' ').map((n: string) => n[0]).join('')}
                          />
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={{ fontWeight: '500', fontSize: 14, color: '#1f2937' }}>{user.name}</Text>
                            <Text style={{ color: '#6b7280', fontSize: 12 }}>NU ID: {user.nuId}</Text>
                            <Text style={{ 
                              color: user.isEligible ? '#059669' : '#dc2626', 
                              fontSize: 12,
                              fontWeight: '500'
                            }}>{user.message}</Text>
                          </View>
                          <Button
                            size="sm"
                            disabled={!user.isEligible || invitedFriends.some(f => f.id === String(user.nuId))}
                            style={{
                              backgroundColor: user.isEligible ? '#3b82f6' : '#d1d5db',
                              minWidth: 60
                            }}
                            onPress={() => {
                              if (user.isEligible) {
                                const newFriend = {
                                  id: String(user.nuId),
                                  name: user.name,
                                  username: String(user.nuId),
                                  avatar: ''
                                };
                                onAddFriend(newFriend);
                                setSearchResults([]);
                                setFriendId('');
                              }
                            }}
                          >
                            {invitedFriends.some(f => f.id === String(user.nuId)) ? 'Added' : 'Add'}
                          </Button>
                        </View>
                      ))}
                    </View>
                  )}
                </CardContainer>

                {/* QuickList Quick Add */}
                {quickLists.length > 0 && (
                  <SectionContainer>
                    <SectionHeader>
                      <Zap size={16} color="#007AFF" />
                      <SectionTitle>Quick Add from Lists</SectionTitle>
                    </SectionHeader>
                    <SpacedContainer>
                      {quickLists.map((list) => (
                        <CardContainer key={list.id}>
                          <ListItemContainer>
                            <AvatarGroup>
                              {list.friends.slice(0, 3).map((friend) => (
                                <AvatarContainer key={friend.id}>
                                  <Avatar 
                                    size={24}
                                    source={friend.avatar ? { uri: friend.avatar } : null}
                                    defaultImage={require('../../assets/default_pic.jpg')}
                                    fallback={friend.name.split(' ').map(n => n[0]).join('')}
                                  />
                                </AvatarContainer>
                              ))}
                              {list.friends.length > 3 && (
                                <AvatarOverflow>
                                  <AvatarOverflowText>
                                    +{list.friends.length - 3}
                                  </AvatarOverflowText>
                                </AvatarOverflow>
                              )}
                            </AvatarGroup>
                            <QuickListInfo>
                              <QuickListName>{list.name}</QuickListName>
                              <QuickListCount>
                                {list.friends.length} friends
                              </QuickListCount>
                            </QuickListInfo>
                            <Button
                              variant="outline"
                              size="sm"
                              onPress={() => handleAddQuickListFriends(list)}
                            >
                              Add All
                            </Button>
                          </ListItemContainer>
                        </CardContainer>
                      ))}
                    </SpacedContainer>
                  </SectionContainer>
                )}

                {/* Invited Friends */}
                {invitedFriends.length > 0 && (
                  <SectionContainer>
                    <HeaderRow>
                      <SectionTitle>Invited Friends</SectionTitle>
                      <Badge variant="secondary">
                        <BadgeContainer>
                          <Users size={12} color="#007AFF" />
                          <Text>{invitedFriends.length}</Text>
                        </BadgeContainer>
                      </Badge>
                    </HeaderRow>
                    <SpacedContainer>
                      {invitedFriends.map((friend) => (
                        <CardContainer key={friend.id}>
                          <ListItemContainer>
                            <Avatar 
                              size={40}
                              source={friend.avatar ? { uri: friend.avatar } : null}
                              defaultImage={require('../../assets/default_pic.jpg')}
                              fallback={friend.name.split(' ').map(n => n[0]).join('')}
                            />
                            
                            <UserInfo>
                              <UserName>{friend.name}</UserName>
                              <Username>@{friend.username}</Username>
                            </UserInfo>

                            <Button
                              variant="ghost"
                              size="icon"
                              onPress={() => onRemoveFriend(friend.id)}
                            >
                              <X size={16} color="#6b7280" />
                            </Button>
                          </ListItemContainer>
                        </CardContainer>
                      ))}
                    </SpacedContainer>
                  </SectionContainer>
                )}
              </SpacedContainer>
            </TabsContent>
            
            <TabsContent value="quicklists">
              <View style={{ flex: 1 }}>
                <SimpleQuickListManager
                  quickLists={quickLists}
                  onCreateList={onCreateQuickList}
                  onUpdateList={onUpdateQuickList}
                  onDeleteList={onDeleteQuickList}
                />
              </View>
            </TabsContent>
          </Tabs>
        </TabsContainer>

        {/* Navigation */}
        <NavigationContainer>
          <Button
            variant="outline"
            onPress={onBack}
            style={{ flex: 1, paddingVertical: 14, minHeight: 48 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={16} color="#007AFF" />
              <Text style={{ marginLeft: 8, color: '#007AFF' }}>Back</Text>
            </View>
          </Button>
          <Button
            onPress={onNext}
            style={{ flex: 1, paddingVertical: 14, minHeight: 48 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#ffffff' }}>Continue</Text>
              <ArrowRight size={16} color="#ffffff" style={{ marginLeft: 8 }} />
            </View>
          </Button>
        </NavigationContainer>
      </MaxWidthContainer>
    </Container>
  );
}

// Demo component with real GraphQL data
export function FriendInvitationDemo() {
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);
  const [route, setRoute] = useState<Route>("home");
  
  const { data: quickListData, loading: quickListsLoading, error: quickListsError } = useQuery(GET_MY_QUICK_LISTS);
  const [createQuickList, { loading: createLoading, error: createError }] = useMutation(CREATE_QUICK_LIST);
  const [updateQuickList, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_QUICK_LIST);
  // Use the proper mutation from mutations.ts
  const [deleteQuickList, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_QUICK_LIST);
  
  const quickLists: QuickList[] = quickListData?.myQuickLists?.map((apiList: ApiQuickList) => ({
    id: apiList.id,
    name: apiList.name,
    friends: apiList.users?.map((user: any) => ({
      id: String(user.nuId), // Use nuId as string to match how we add friends
      username: user.name.toLowerCase().replace(/\s+/g, ''), 
      name: user.name, 
      avatar: null, // Will use defaultImage fallback
    })) || []
  })) || [];
  
  // Show loading state
  if (quickListsLoading) {
    return (
      <Container>
        <MaxWidthContainer>
          <Text style={{ textAlign: 'center', padding: 20 }}>Loading quicklists...</Text>
        </MaxWidthContainer>
      </Container>
    );
  }

  // Show error state
  if (quickListsError) {
    return (
      <Container>
        <MaxWidthContainer>
          <Text style={{ textAlign: 'center', padding: 20, color: 'red' }}>
            Error loading quicklists: {quickListsError.message}
          </Text>
        </MaxWidthContainer>
      </Container>
    );
  }

  const handleAddFriend = (friend: Friend) => {
    // Check if friend is already invited
    const alreadyInvited = invitedFriends.find(invited => invited.id === friend.id);
    if (!alreadyInvited) {
      setInvitedFriends(prev => [...prev, friend]);
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    setInvitedFriends(prev => prev.filter(friend => friend.id !== friendId));
  };

  const handleAddQuickList = (friends: Friend[]) => {
    const newFriends = friends.filter(
      friend => !invitedFriends.find(invited => invited.id === friend.id)
    );
    setInvitedFriends(prev => [...prev, ...newFriends]);
  };

  const handleCreateQuickList = (list: Omit<QuickList, 'id'>) => {
    createQuickList({
      variables: {
        name: list.name,
        nuIds: list.friends.map(f => parseInt(f.id))
      },
      refetchQueries: [{ query: GET_MY_QUICK_LISTS }]
    })
      .then(result => {
        if (result.data?.createQuickList?.success) {
          console.log('QuickList created:', result.data.createQuickList.quickList);
        } else {
          console.error('Failed to create quicklist');
        }
      })
      .catch(error => {
        console.error('Error creating quicklist:', error);
      });
  };

  const handleUpdateQuickList = (listId: string, list: Omit<QuickList, 'id'>) => {
    console.log('📝 Updating quicklist:', listId, list);
    
    // Find the original list to compare changes
    const originalList = quickLists.find(ql => ql.id === listId);
    if (!originalList) {
      console.error('Original list not found for update');
      return;
    }
    
    // Get the current friend nu_ids and new friend nu_ids
    const originalNuIds = originalList.friends.map(f => parseInt(f.id));
    const newNuIds = list.friends.map(f => parseInt(f.id));
    
    // Find users to add (in new list but not in original)
    const usersToAdd = newNuIds.filter(id => !originalNuIds.includes(id));
    
    // Find users to remove (in original but not in new list)
    const usersToRemove = originalNuIds.filter(id => !newNuIds.includes(id));
    
    console.log('Users to add:', usersToAdd);
    console.log('Users to remove:', usersToRemove);
    
    // Function to execute update mutation
    const executeUpdate = async (nuIds: number[], addUsers: boolean) => {
      if (nuIds.length === 0) return Promise.resolve();
      
      try {
        const result = await updateQuickList({
          variables: {
            quicklistId: listId,
            nuIds: nuIds,
            addUsers: addUsers
          },
          refetchQueries: [{ query: GET_MY_QUICK_LISTS }]
        });
        
        console.log(`✅ ${addUsers ? 'Added' : 'Removed'} users successfully:`, nuIds);
        return result;
      } catch (error: any) {
        console.warn(`⚠️ Failed to ${addUsers ? 'add' : 'remove'} users ${nuIds}:`, error.message);
        
        // If it's a "users not found" error, we can continue with the operation
        if (error.message.includes('Users with NU IDs not found')) {
          console.log('🔄 Continuing with other operations despite missing users...');
          return Promise.resolve();
        }
        
        // For other errors, re-throw
        throw error;
      }
    };
    
    // Execute updates sequentially, but don't stop if one fails
    Promise.resolve()
      .then(() => executeUpdate(usersToRemove, false)) // Remove users first
      .then(() => executeUpdate(usersToAdd, true))     // Then add users
      .then(() => {
        console.log('✅ QuickList update completed');
      })
      .catch(error => {
        console.error('❌ Error updating quicklist:', error);
      });
  };

  const handleDeleteQuickList = async (listId: string) => {
    console.log('🗑️ Attempting to delete quicklist with ID:', listId);
    
    // Check authentication token
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('token');
    console.log('� Current auth token:', token ? 'Token exists' : 'No token found');

    try {
      const result = await deleteQuickList({
        variables: { quicklistID: listId },
        refetchQueries: [{ query: GET_MY_QUICK_LISTS }],
      });
      
      console.log('✅ Delete mutation result:', result);
      
      if (result.data?.deleteQuickList?.success) {
        console.log('QuickList deleted successfully:', result.data.deleteQuickList.message);
      } else {
        console.error('Failed to delete quicklist:', result.data?.deleteQuickList?.message);
      }
    } catch (error: any) {
      console.error('❌ Error deleting quicklist:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        variables: { quicklistID: listId }
      });
      
      // Additional debugging
      if (error.networkError) {
        console.error('Network error details:', error.networkError);
      }
    }
  };

  const handleBack = () => {
    setRoute("home");

  };

  const handleNext = () => {
    console.log('Next pressed');
  };

  return (
    <FriendInvitation
      invitedFriends={invitedFriends}
      quickLists={quickLists}
      onAddFriend={handleAddFriend}
      onRemoveFriend={handleRemoveFriend}
      onAddQuickList={handleAddQuickList}
      onCreateQuickList={handleCreateQuickList}
      onUpdateQuickList={handleUpdateQuickList}
      onDeleteQuickList={handleDeleteQuickList}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}