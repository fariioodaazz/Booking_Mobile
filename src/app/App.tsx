import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppProviders } from "src/app/providers";
import { apolloClient } from "src/lib/apollo/client";
import Login from "src/screens/Login";
import Home from "src/screens/Home";
import { Regulations } from "src/screens/Regulations";
import { FriendInvitationDemo } from "src/screens/FriendInvitation";
import { ThemeProvider } from "styled-components/native";
import { theme } from "src/components/styles/theme";



type Route = "home" | "regulations" | "friendInvitation";


const DEFAULT_CATEGORY_ID = "1";

export default function App() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [route, setRoute] = useState<Route>("home");

  // Friend invitation state
  const [invitedFriends, setInvitedFriends] = useState<any[]>([]);
  const [quickLists, setQuickLists] = useState<any[]>([]);

  useEffect(() => {
    (async () => setHasToken(!!(await AsyncStorage.getItem("token"))))();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await apolloClient.clearStore();
    } finally {
      setHasToken(false);
      setRoute("home");
    }
  };

  // Friend invitation handlers
  const handleAddFriend = (friend: any) => {
    setInvitedFriends(prev => [...prev, friend]);
  };

  const handleRemoveFriend = (friendId: string) => {
    setInvitedFriends(prev => prev.filter(f => f.id !== friendId));
  };

  const handleAddQuickList = (friends: any[]) => {
    const newFriends = friends.filter(
      friend => !invitedFriends.find(invited => invited.id === friend.id)
    );
    setInvitedFriends(prev => [...prev, ...newFriends]);
  };

  const handleCreateQuickList = (list: any) => {
    const newList = {
      ...list,
      id: Date.now().toString()
    };
    setQuickLists(prev => [...prev, newList]);
  };

  const handleUpdateQuickList = (listId: string, updatedList: any) => {
    setQuickLists(prev => prev.map(list =>
      list.id === listId ? { ...updatedList, id: listId } : list
    ));
  };

  const handleDeleteQuickList = (listId: string) => {
    setQuickLists(prev => prev.filter(list => list.id !== listId));
  };

  if (hasToken === null) return null;

  return (
    <ThemeProvider theme={theme}>
      <AppProviders>
        {hasToken ? (
          route === "home" ? (
            <Home
              onBookCourt={() => setRoute("regulations")}
              onLogout={handleLogout}
            />
          ) : route === "friendInvitation" ? (
            <FriendInvitationDemo />
          ) : route === "regulations" ? (
            <Regulations
              categoryId={DEFAULT_CATEGORY_ID}
              headerTitle="NU Sports Booking"
              headerSubtitle="Nile University Sports Facilities"
              policiesTitle="Sports Facilities Policies"
              onShowReservations={() => { setRoute("friendInvitation") }}
              onReserve={() => setRoute("home")}
              onBackHome={() => setRoute("home")}
            />
          ) : (
            <></>
          )
        ) : (
          <Login onLoggedIn={() => setHasToken(true)} />
        )}
      </AppProviders>
    </ThemeProvider>
  );
}
