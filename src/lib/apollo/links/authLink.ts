import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});
