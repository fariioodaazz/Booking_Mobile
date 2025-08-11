import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppProviders } from "src/app/providers";
import { apolloClient } from "src/lib/apollo/client";
import Login from "src/screens/Login";
import Home from "src/screens/Home";
import { RegulationsScreen } from "src/screens/Regulations";

type Route = "home" | "regulations";

const DEFAULT_FACILITY_ID = "3"; 

export default function App() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [route, setRoute] = useState<Route>("home");

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

  if (hasToken === null) return null;

  return (
    <AppProviders>
      {hasToken ? (
        route === "home" ? (
          <Home
            onBookCourt={() => setRoute("regulations")}
            onLogout={handleLogout}
          />
        ) : (
          <RegulationsScreen
            facilityId={DEFAULT_FACILITY_ID}
            onShowReservations={() => {/* navigate to your reservations flow if you want */}}
            onReserve={() => {/* navigate to reserve flow */}}
            onBackHome={() => setRoute("home")}
          />
        )
      ) : (
        <Login onLoggedIn={() => setHasToken(true)} />
      )}
    </AppProviders>
  );
}
