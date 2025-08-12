import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppProviders } from "src/app/providers";
import { apolloClient } from "src/lib/apollo/client";
import Login from "src/screens/Login";
import Home from "src/screens/Home";
import { RegulationsScreen } from "src/features/regulations/components/RegulationsScreen";
import { ThemeProvider } from "styled-components/native";
import { theme } from "src/shared/styles/theme";


type Route = "home" | "regulations";

const DEFAULT_CATEGORY_ID = "1";

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
    <ThemeProvider theme={theme}>
      <AppProviders>
        {hasToken ? (
          route === "home" ? (
            <Home
              onBookCourt={() => setRoute("regulations")}
            onLogout={handleLogout}
          />
        ) : (
          <RegulationsScreen
            categoryId={DEFAULT_CATEGORY_ID}
            onShowReservations={() => {/* navigate to your reservations flow if you want */}}
            onReserve={() => setRoute("home")}
            onBackHome={() => setRoute("home")}
          />
        )
      ) : (
        <Login onLoggedIn={() => setHasToken(true)} />
      )}
    </AppProviders>
    </ThemeProvider>
  );
}
