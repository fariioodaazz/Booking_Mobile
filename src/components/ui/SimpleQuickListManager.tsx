import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { View, Text, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Button } from './button';
import { Input } from './input';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { useQuery } from '@apollo/client';
import { SEARCH_USER_BY_NU_ID } from '../../api/quicklist/mutations';
import { Plus, Users, Edit3, Trash2, UserPlus, X } from 'lucide-react-native';
import { Search } from 'lucide-react-native';

const Container = styled.View`
  flex: 1;
  gap: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
`;

const CreateButton = styled.View`
  margin-bottom: 16px;
`;

const FormContainer = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border-width: 1px;
  border-color: #e5e7eb;
  margin-bottom: 16px;
  gap: 12px;
`;

const ListsContainer = styled.View`
  gap: 8px;
`;

const ListCard = styled.View`
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
  margin-bottom: 8px;
`;

const ListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ListTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const FriendsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 32px 16px;
`;

const EmptyText = styled.Text`
  color: #6b7280;
  font-size: 14px;
  text-align: center;
`;

const FormRow = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const FormTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const FriendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: #f9fafb;
  padding: 8px 12px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const FriendName = styled.Text`
  font-size: 14px;
  color: #374151;
`;

const BadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
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

interface SimpleQuickListManagerProps {
  quickLists: QuickList[];
  onCreateList: (list: Omit<QuickList, 'id'>) => void;
  onUpdateList: (listId: string, list: Omit<QuickList, 'id'>) => void;
  onDeleteList: (listId: string) => void;
}

export function SimpleQuickListManager({ quickLists, onCreateList, onUpdateList, onDeleteList }: SimpleQuickListManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingList, setEditingList] = useState<QuickList | null>(null);
  const [listName, setListName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [friendId, setFriendId] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { refetch: searchUser } = useQuery(SEARCH_USER_BY_NU_ID, { skip: true });

  
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

  const handleRemoveFriend = (friendId: string) => {
    setSelectedFriends(selectedFriends.filter(f => f.id !== friendId));
  };

  const handleSaveList = () => {
    if (listName.trim() && selectedFriends.length > 0) {
      const listData = {
        name: listName.trim(),
        friends: selectedFriends
      };

      if (editingList) {
        onUpdateList(editingList.id, listData);
      } else {
        onCreateList(listData);
      }
      
      resetForm();
    } else {
      console.log('Error: Please enter a list name and add at least one friend');
    }
  };

  const handleEditList = (list: QuickList) => {
    setEditingList(list);
    setListName(list.name);
    setSelectedFriends([...list.friends]);
    setIsCreating(true);
  };

  const handleDeleteList = (listId: string) => {
    const listToDelete = quickLists.find(list => list.id === listId);
    const listName = listToDelete?.name || 'this quicklist';
    
    Alert.alert(
      'Delete Quicklist',
      `Are you sure you want to delete "${listName}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteList(listId),
        },
      ],
      { cancelable: true }
    );
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingList(null);
    setListName('');
    setSelectedFriends([]);
    setFriendId('');
  };

  return (
    <Container>
      {!isCreating && (
        <CreateButton>
          <Button size="sm" onPress={() => setIsCreating(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Plus size={16} color="#ffffff" />
              <Text style={{ color: '#ffffff', marginLeft: 8 }}>Create New List</Text>
            </View>
          </Button>
        </CreateButton>
      )}

      {isCreating && (
        <FormContainer>
          <FormTitle>{editingList ? 'Edit List' : 'Create New List'}</FormTitle>
          
          <View>
            <Text style={{ marginBottom: 8, fontWeight: '500' }}>List Name</Text>
            <Input
              placeholder="Enter list name"
              value={listName}
              onChangeText={setListName}
            />
          </View>

          <View>
            <Text style={{ marginBottom: 8, fontWeight: '500' }}>Add Friends by NU ID</Text>
            <FormRow>
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
                  onChangeText={setFriendId}
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
            </FormRow>
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
                      defaultImage={require('../../../assets/default_pic.jpg')}
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
                      disabled={!user.isEligible || selectedFriends.some(f => f.id === String(user.nuId))}
                      style={{
                        backgroundColor: user.isEligible ? '#3b82f6' : '#d1d5db',
                        minWidth: 60
                      }}
                      onPress={() => {
                        const newFriend: Friend = {
                          id: String(user.nuId),
                          name: user.name,
                          username: String(user.nuId),
                          avatar: '' // Set empty string instead of require
                        };
                        setSelectedFriends(prev => [...prev, newFriend]);
                        setSearchResults([]);
                        setFriendId('');
                      }}
                    >
                      {selectedFriends.some(f => f.id === String(user.nuId)) ? 'Added' : 'Add'}
                    </Button>
                  </View>
                ))}
              </View>
            )}
          </View>

          {selectedFriends.length > 0 && (
            <View>
              <Text style={{ marginBottom: 8, fontWeight: '500' }}>
                Selected Friends ({selectedFriends.length})
              </Text>
              <FriendsGrid>
                {selectedFriends.map((friend) => (
                  <FriendItem key={friend.id}>
                    <Avatar
                      size={24}
                      source={friend.avatar ? { uri: friend.avatar } : null}
                      defaultImage={require('../../../assets/default_pic.jpg')}
                      fallback={friend.name.split(' ').map(n => n[0]).join('')}
                    />
                    <FriendName>{friend.name}</FriendName>
                    <Button
                      variant="ghost"
                      size="icon"
                      onPress={() => handleRemoveFriend(friend.id)}
                      style={{ width: 24, height: 24 }}
                    >
                      <X size={12} color="#6b7280" />
                    </Button>
                  </FriendItem>
                ))}
              </FriendsGrid>
            </View>
          )}

          <FormRow>
            <Button variant="outline" style={{ flex: 1 }} onPress={resetForm}>
              Cancel
            </Button>
            <Button
              style={{ flex: 1 }}
              onPress={handleSaveList}
              disabled={!listName.trim() || selectedFriends.length === 0}
            >
              {editingList ? 'Update List' : 'Create List'}
            </Button>
          </FormRow>
        </FormContainer>
      )}

      <ListsContainer>
        {quickLists.length > 0 ? (
          quickLists.map((list) => (
            <ListCard key={list.id}>
              <ListHeader>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ListTitle>{list.name}</ListTitle>
                  <Badge variant="secondary">
                    <BadgeContainer>
                      <Users size={12} color="#007AFF" />
                      <Text style={{ fontSize: 12 }}>{list.friends.length}</Text>
                    </BadgeContainer>
                  </Badge>
                </View>
                <ActionButtons>
                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={() => handleEditList(list)}
                  >
                    <Edit3 size={16} color="#007AFF" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={() => handleDeleteList(list.id)}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </Button>
                </ActionButtons>
              </ListHeader>
              
              <FriendsGrid>
                {list.friends.map((friend) => (
                  <Avatar
                    key={friend.id}
                    size={24}
                    source={friend.avatar ? { uri: friend.avatar } : null}
                    defaultImage={require('../../../assets/default_pic.jpg')}
                    fallback={friend.name.split(' ').map(n => n[0]).join('')}
                  />
                ))}
              </FriendsGrid>
            </ListCard>
          ))
        ) : (
          <EmptyState>
            <Users size={48} color="#d1d5db" />
            <EmptyText style={{ marginTop: 16 }}>
              No quick lists yet.{'\n'}Create your first list to get started!
            </EmptyText>
          </EmptyState>
        )}
      </ListsContainer>
    </Container>
  );
}
