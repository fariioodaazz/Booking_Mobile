import React, { useEffect, useState } from "react";
import { AppProviders } from "./providers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apolloClient } from "../lib/apollo/client";
import {Home} from "../screens/Home";
import Login from "../screens/Login";

export default function App() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => setHasToken(!!(await AsyncStorage.getItem("token"))))();
  }, []);

  if (hasToken === null) return null;


  return (
    <AppProviders>
      {hasToken ? <Home /> : <Login onLoggedIn={() => setHasToken(true)} />}
    </AppProviders>
  );
}
