import React, { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apolloClient } from "../lib/apollo/Client";
import {Home} from "../screens/Home";
import Login from "../screens/Login";

export default function App() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => setHasToken(!!(await AsyncStorage.getItem("token"))))();
  }, []);

  if (hasToken === null) return null; // splash/loading

  return (
    <ApolloProvider client={apolloClient}>
      {hasToken ? <Home /> : <Login onLoggedIn={() => setHasToken(true)} />}
    </ApolloProvider>
  );
}
