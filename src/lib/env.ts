import Constants from "expo-constants";
import { Platform } from "react-native";

export const getGraphqlUrl = () => {
  const fromEnv = process.env.EXPO_PUBLIC_GRAPHQL_URL;
  const fromExtra = (Constants?.expoConfig?.extra as any)?.GRAPHQL_URL;
  const fallback =
    Platform.OS === "web"
      ? "http://localhost:8000/graphql/"
      : "http://10.0.2.2:8000/graphql/";
  return fromEnv ?? fromExtra ?? fallback;
};
